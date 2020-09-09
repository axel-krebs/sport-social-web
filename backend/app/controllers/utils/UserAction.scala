package controllers.utils

import javax.inject.Inject
import models.User
import play.api.mvc.Results._
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

case class UserRequest[A](user: Option[User], request: Request[A]) extends WrappedRequest[A](request)

class UserAction @Inject()(val parser: BodyParsers.Default)(implicit val executionContext: ExecutionContext)
  extends ActionBuilder[UserRequest, AnyContent] with ActionTransformer[Request, UserRequest] {

  import org.slf4j.{Logger, LoggerFactory}

  val LOG: Logger = LoggerFactory.getLogger(classOf[UserAction])

  /* Transform the normal Request object to a UserRequest object containing User data like settings etc.
  *  Retrieve User object from cache according to key saved in "sposo-connect" cookie, th.i. her email
  *  address. The session cache must be initialized on log-in, see method authenticate in HomeController! */
  override def transform[AnyContent](request: Request[AnyContent]): Future[UserRequest[AnyContent]] = {
    request.session.get("sposo-connect")
      .map { userEmail: String =>
          Future.successful {

            // The user may be empty (Option) - must be handled on callers side!
            new UserRequest(SessionManagement.getUser(userEmail), request)
          }
        }

      // sposo-connect not found in header - illegal invocation of userAction!
      .getOrElse(
        Future.failed(new Exception("User not in session."))
      )
  }
}
