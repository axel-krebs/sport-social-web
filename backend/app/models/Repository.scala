package models

import slick.jdbc.PostgresProfile

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}
import scala.language.higherKinds

/** The slice of the cake which provides the Slick profile */
trait ProfileComponent {
  val profile: PostgresProfile = slick.jdbc.PostgresProfile
}

/* Designed Repository as object for usability (static methods) */
object Repository extends ProfileComponent {
  import profile.api._

  /* Database per config, see conf/application.conf */
  val db = Database.forConfig("pg12_ds")

  /* SQL type java.sql.Date needs mapping to java.util.Date */
  implicit val JavaUtilDateMapper =
    MappedColumnType.base[java.util.Date, java.sql.Date](
      d => new java.sql.Date(d.getTime),
      d => new java.util.Date(d.getTime))

  /* The APP_USER_PREFS table mapping */
  class UserPreferencesSchema(tag: Tag) extends Table[(UserPreferences)](tag, "app_user_prefs") {
    def userKey = column[Long]("app_user_id") // no primary key here!
    def notifyMe = column[Boolean]("notify_me")
    def notifyPerEmail = column[Boolean]("notify_per_email")
    def * = (notifyMe, notifyPerEmail) <> (UserPreferences.tupled, UserPreferences.unapply(_))
  }
  def preferences = TableQuery[UserPreferencesSchema]

  /* The APP_USER table mapping */
  class Users(tag: Tag) extends Table[(User)](tag, "app_user") {
    def userKey = column[Long]("id", O.PrimaryKey)
    def nickname = column[String]("nickname")
    def password = column[String]("password")
    def email = column[String]("email")
    def verified = column[Boolean]("verified")
    def prefs = foreignKey("app_user_prefs", userKey, preferences)(_.userKey)
    def * = (userKey, nickname, password, email, verified) <> (User.tupled, User.unapply(_))
  }
  val users = TableQuery[Users]

  /* The PLAYER table mapping */
  class Players(tag: Tag) extends Table[(Player)](tag, "player") {
    def key = column[Long]("id", O.PrimaryKey)
    def sureName = column[String]("surename")
    def foreName = column[String]("forename")
    def birthDate = column[java.util.Date]("date_birth")(JavaUtilDateMapper)
    def * = (key, sureName, foreName, birthDate) <> (Player.tupled, Player.unapply(_))
  }
  val players = TableQuery[Players]

  /* public methods */

  /*
   * Search a User entry by name and password; the return value of Option indicates that a possible NULL value may be
   * returned!
   */
  def findUserByNickNameOrEmail(nickNameOrEmail: String): Option[User] = {
    val q = db.run(
      users.filter(_.nickname === nickNameOrEmail).result.headOption
    )
    Await.result(q, Duration.Inf)
  }

  def findUserPreferences(nickNameOrEmail: String): Option[(User, Option[UserPreferences])] = {
    val oneUser = users.filter(_.nickname === nickNameOrEmail)
    val userWithPrefs = for {
      (u, us) <- oneUser joinLeft preferences on (_.userKey === _.userKey)
    } yield (u, us)

    val q = db.run(
      userWithPrefs.result.headOption
    )
    Await.result(q, Duration.Inf)
  }

  val findAllPlayers = players.result
  def getAllPlayers(): Seq[Player] = {
    val all_query_future = db.run(findAllPlayers)
    Await.result(all_query_future, Duration.Inf)
  }

  /* create a new PLAYER from player object */
  def create(player: Player): DBIO[Int] =
    players += player

  /** Retrieve a Player from the id. */
  def findById(id: Long): Future[Option[Player]] = {
    try {
      db.run(players.filter(_.key === id).result.headOption)
    } finally db.close()
  }

  /* A helper class for db specific operations */
  //class DAOHelper(val dao: PlayerDAL) {
  //    	import dao.profile.api._
  //def restrictKey[C[_]](s: String, q: Query[DAO#Props, _, C]) = q.filter(_.key === s)
  //}
}
