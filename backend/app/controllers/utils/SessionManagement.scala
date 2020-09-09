package controllers.utils

import models._
import com.github.benmanes.caffeine.cache._
import java.util.concurrent.TimeUnit

case class SessionManagement() {
}

object SessionManagement {

  val SESSION_TIMEOUT: Int = 60 // minutes

  val MAX_USERS: Int = 10000

  var cache: Cache[String, User] = Caffeine.newBuilder()
    .expireAfterWrite(this.SESSION_TIMEOUT, TimeUnit.MINUTES)
    .maximumSize(this.MAX_USERS)
    .build()

  def createSession(user: User) = {
    cache.put(user.email, user)
  }

  def getUser(sposoCookie: String): Option[User] = {
    Option(cache.getIfPresent(sposoCookie))
  }

  def refresh(email: String): Option[User] = {
    Option(cache.getIfPresent(email));
  }

  def disposeSession(user: User): Boolean = {
    cache.invalidate(user.email)
    true
  }
}