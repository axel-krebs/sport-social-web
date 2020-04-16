package controllers.rest

import javax.inject.Inject
import models._
import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.api.mvc._

class RestController @Inject() (cc: ControllerComponents) extends AbstractController(cc) {

  implicit val locationWrites: Writes[Location] =
    (JsPath \ "lat").write[Double].and((JsPath \ "long").write[Double])(unlift(Location.unapply))

  implicit val placeWrites: Writes[Place] =
    (JsPath \ "name").write[String].and((JsPath \ "location").write[Location])(unlift(Place.unapply))

  implicit val locationReads: Reads[Location] =
    (JsPath \ "lat").read[Double].and((JsPath \ "long").read[Double])(Location.apply _)

  implicit val placeReads: Reads[Place] =
    (JsPath \ "name").read[String].and((JsPath \ "location").read[Location])(Place.apply _)

  def listPlaces = Action {
    val json = Json.toJson(Place.list)
    Ok(json)
  }

  def post() = Action(parse.json) {
    implicit request =>
    Ok(JsString("OK"))
  }
}