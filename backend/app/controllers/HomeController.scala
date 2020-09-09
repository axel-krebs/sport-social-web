package controllers

import javax.inject._
import models._
import play.api._
import _root_.controllers.utils._
import play.api.data.Form
import play.api.data.Forms._
import play.api.i18n.I18nSupport
import play.api.mvc._

import scala.concurrent.Future

/**
 * Used for User - Actions like displaying welcome content, editing user settings etc.
 */
@Singleton
class HomeController @Inject()(implicit
                               controllerComponents: ControllerComponents,
                               userAction: UserAction)
  extends AbstractController(controllerComponents) with I18nSupport {

  val LOG: Logger = Logger("play")

  /* LOGIN form */
  val loginForm: Form[LoginData] = Form(
    mapping(
      "loginName" -> nonEmptyText,
      "loginPass" -> nonEmptyText)(LoginData.apply)(LoginData.unapply))

  /* Unauthenticated request (landing page) - check cookie */
  def index() = Action {
    implicit request: Request[AnyContent] =>

      // is there any cookie?
      request.session.get("sposo-connect").map {
        email =>
          LOG.info("HOME - sposo-connect cookie was present!")

          // Second condition: is user still in cache?
          SessionManagement.getUser(email) match {
            case Some(user) => {
              LOG.info("""HOME - user found in cache!""")
              Redirect(routes.HomeController.home())
            }
            case None => Ok(views.html.index(None))
          }
      }
        // there was no cookie, display landing page
        .getOrElse(Ok(views.html.index(None)))
  }

  def login() = Action {
    implicit request: Request[AnyContent] =>
      Ok(views.html.login(loginForm))
  }

  /* Invoked when login form is sent; not yet a user action! */
  def authenticate() = Action {
    implicit request: Request[AnyContent] =>
      val inputDataForm = loginForm.bindFromRequest()
      inputDataForm.fold(
        hasErrors = { form =>

          // redirect to login, keep input
          BadRequest(views.html.login(form))
        },
        success = { loginData =>
          var userOpt = Repository.findUserByNickNameOrEmail(loginData.loginName)
          userOpt.map {
            user =>

              // OK, user found in database; but is password correct??
              if (user.passWord equals loginData.loginPass) {
                SessionManagement.createSession(user)
                Redirect(routes.HomeController.home()).withSession("sposo-connect" -> user.email)
              }
              else {
                BadRequest(views.html.login(loginForm))
              }
          }.getOrElse {
            BadRequest(views.html.login(loginForm))
          }
        })
  }

  /* User home */
  def home() = userAction {
    implicit request: UserRequest[AnyContent] =>
      Ok(views.html.home(request.user))

  }
  def logout() = userAction {
    implicit request: UserRequest[AnyContent] =>
      request.user.foreach { user => SessionManagement.disposeSession(user) }
      Redirect(routes.HomeController.index()).withNewSession
  }

  /* Click on user icon */
  def usersettings() = userAction {
    implicit request: UserRequest[AnyContent] =>
      var usv = views.html.usersettings(request.user)
      Ok(usv)
  }
}
