package controllers

import controllers.html5controllers._
import controllers.utils._
import javax.inject._
import models._
import play.api.i18n.I18nSupport
import play.api.libs.json._
import play.api.mvc._
import play.twirl.api.Html

class TestController @Inject() (implicit 
    val controllerComponents: ControllerComponents, 
    val userAction: UserAction)
  extends BaseController with I18nSupport {

  def index() = userAction {
    implicit request: UserRequest[AnyContent] =>
      Ok(views.html.test(request.user, cmbController))
  }

  val cmbController = new HTML5ComboBoxController() {
    override def options() = List(HTML5Option("hallo-1", "Hallo-1"), HTML5Option("hallo-2", "Hallo-2"))
    override def onSelect(elem: Html) = {
      println(elem)
    }
  }

  def post() = Action {
    implicit request =>
      Ok(JsString("Selected"))
  }

  def searchPlayer() = userAction {
    implicit request: UserRequest[AnyContent] =>
      {
        var users = Repository.getAllPlayers()
        Ok(views.html.playersearch(users, request.user))
      }
  }
}