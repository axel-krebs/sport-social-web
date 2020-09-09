package controllers.html5controllers

import play.twirl.api.Html

trait HTML5ComboBoxController {
  val id = "combo-1"
  def options(): List[HTML5Option]
  def onSelect(elem: Html): Unit
}
case class HTML5Option(value: String, name: String)