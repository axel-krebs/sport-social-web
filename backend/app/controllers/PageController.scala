package controllers

import javax.inject._
import models._
import play.api._
import _root_.controllers.utils._
import play.api.data.Form
import play.api.data.Forms._
import play.api.i18n.I18nSupport
import play.api.mvc._

@Singleton
class PageController @Inject()(implicit
                               controllerComponents: ControllerComponents,
                               userAction: UserAction)
  extends AbstractController(controllerComponents) with I18nSupport {

  /* User home */
  def userHome() = userAction {
    implicit request: UserRequest[AnyContent] =>
      Ok(views.html.user_home(request.user))
  }

  def userProfile() = userAction {
    implicit request: UserRequest[AnyContent] =>
      Ok(views.html.user_profile(request.user))
  }

  def userSettings() = userAction {
    implicit request: UserRequest[AnyContent] =>
      Ok(views.html.user_settings(request.user))
  }

}
