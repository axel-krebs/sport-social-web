package models

import java.util.Date

import play.api.libs.json.Json

trait Preferences {

  /* NULL OBJECT */
  def defaults = new UserPreferences(Boolean.box(false), Boolean.box(false)) {
    val sport = "Fussball"
  }
}

case class UserPreferences(notifyMe: Boolean, notifyPerEmail: Boolean) extends Preferences {
  implicit val jsonFormat = Json.format[UserPreferences]
}

case class User(id: Long, nickName: String, passWord: String, email: String, verified: Boolean) extends Preferences {
  
}

/* null object needed for session management */
object NullUser extends User(0, "John", "Doe", "john.doe@acme.com", false) {
  val prefs = defaults 
  // any own properties?
}

/* A 'user' needn't be a player at the same time, but a player CAN be a user! */
case class Player(id: Long = 0, sureName: String, foreName: String, birthDate: Date) {
  implicit val jsonFormat = Json.format[Player]
  val findMe: Boolean = false
}

