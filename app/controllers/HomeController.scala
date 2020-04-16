package controllers

import javax.inject._
import models._
import play.api._
import _root_.controllers.utils._
import play.api.data.Form
import play.api.data.Forms._
import play.api.i18n.I18nSupport
import play.api.mvc._

/**
 * Used for User - Actions like displaying welcome content, editing user settings etc.
 */
@Singleton
class HomeController @Inject() (implicit 
    controllerComponents: ControllerComponents, 
    userAction: UserAction)
  extends AbstractController(controllerComponents) with I18nSupport {

  val LOG: Logger = Logger("debugger")

  /* LOGIN form */
  val loginForm: Form[LoginData] = Form(
    mapping(
      "loginName" -> nonEmptyText,
      "loginPass" -> nonEmptyText)(LoginData.apply)(LoginData.unapply))

  /* Unauthenticated request */
  def index() = Action {
    implicit request: Request[AnyContent] =>
      Ok(views.html.index(loginForm))
  }

  /*  */
  def authenticate() = Action {
    implicit request: Request[AnyContent] =>
      val inputDataForm = loginForm.bindFromRequest()
      inputDataForm.fold(
        hasErrors = { form =>

          // redirect to login
          BadRequest(views.html.index(form))
        },
        success = { loginData =>
          var userOpt = Repository.findUserByNickNameOrEmail(loginData.loginName)
          if (userOpt.get.passWord.equals(loginData.loginPass)) {
            Redirect(routes.HomeController.home()).withSession(request.session + "sposo-connect" -> userOpt.get.email)
          } else {
            BadRequest(views.html.index(loginForm))
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
      SessionManagement.disposeSession(request.user)
      Redirect(routes.HomeController.index()).withNewSession
  }

  def usersettings() = userAction {
    implicit request: UserRequest[AnyContent] =>
      var usv = views.html.usersettings(request.user);
      Ok(usv)
  }
}
