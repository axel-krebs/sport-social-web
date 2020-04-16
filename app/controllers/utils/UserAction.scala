package controllers.utils

import javax.inject.Inject
import models.User
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

case class UserRequest[A](user: User, request: Request[A]) extends WrappedRequest[A](request)

class UserAction @Inject() (val parser: BodyParsers.Default)(implicit val executionContext: ExecutionContext)
  extends ActionBuilder[UserRequest, AnyContent] with ActionTransformer[Request, UserRequest] {

  /* Transform the normal Request object to a UserRequest object containing User data like settings etc.*/
  override def transform[AnyContent](request: Request[AnyContent]): Future[UserRequest[AnyContent]] = {
    var sposoCookie = request.session.get("sposo-connect")
    Future.successful {
      new UserRequest(SessionManagement.currentUser, request)
    }
  }
}