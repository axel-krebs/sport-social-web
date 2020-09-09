package controllers

import javax.inject.Inject
import models._
import play.api.Logger
import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.api.mvc._

class RestController @Inject() (cc: ControllerComponents) extends AbstractController(cc) {

  val LOG: Logger = Logger("play")

  implicit val locationReads: Reads[Location] =
    (JsPath \ "lat").read[Double].and((JsPath \ "long").read[Double])(Location.apply _)

  implicit val locationWrites: Writes[Location] =
    (JsPath \ "lat").write[Double].and((JsPath \ "long").write[Double])(unlift(Location.unapply))

  implicit val placeWrites: Writes[Place] =
    (JsPath \ "name").write[String].and((JsPath \ "location").write[Location])(unlift(Place.unapply))

  implicit val placeReads: Reads[Place] =
    (JsPath \ "name").read[String].and((JsPath \ "location").read[Location])(Place.apply _)

  implicit val loginDataReads: Reads[LoginData] =
    (JsPath \ "nickName").read[String].and((JsPath \ "passWord").read[String])(LoginData.apply _)

  implicit val loginDataWrites: Writes[LoginData] =
    (JsPath \ "nickName").write[String].and((JsPath \ "passWord").write[String])(unlift(LoginData.unapply))

  implicit val userWrites: Writes[User] = (
    (JsPath \ "id").write[Long] and
      (JsPath \ "nickName").write[String] and
      (JsPath \ "passWord").write[String] and
      (JsPath \ "email").write[String] and
      (JsPath \ "verified").write[Boolean]
    )(unlift(User.unapply))

  implicit val userPrefsWrites: Writes[UserPreferences] = (
    (JsPath \ "notifyMe").write[Boolean] and
      (JsPath \ "notifyPerEmail").write[Boolean]
  )(unlift(UserPreferences.unapply))

  def listPlaces = Action {
    val json = Json.toJson(Place.list)
    Ok(json)
  }

  def post() = Action(parse.json) {
    implicit request =>
    Ok(JsString("OK"))
  }

  def index = Action {
    Ok(JsString("TODO: List all API calls."))
  }

  def user(nickName: String, passWord: String) = Action {
    implicit request =>
      LOG.info("RestController -> user(); request: " + request)
      var userOpt = Repository.findUserPreferences(nickName)
      userOpt match {
        case Some(userAndPrefs) => {
          val dbUser = userAndPrefs._1
          if(dbUser.passWord == passWord) {
            val userJson = Json.toJson(dbUser)
            val prefs = userAndPrefs._2
            val prefsJson = Json.toJson(prefs.get)
            val userAndPrefsJson = userJson.as[JsObject] + ("prefs", prefsJson.as[JsValue])
            Ok(userAndPrefsJson)
          }
          else {
            BadRequest(JsString("Password not correct."))
          }
        }
        case None => BadRequest(JsString("User not found."))
      }

  }
}