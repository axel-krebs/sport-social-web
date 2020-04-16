package controllers.utils

import models._

trait SessionManagement {
  var user: User = NullUser
}
object SessionManagement {

  var currentUser: User = NullUser
  
  def disposeSession(user: User): Boolean = {
    currentUser = NullUser
    true
  }
}