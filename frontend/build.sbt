name := """sport-social-web-frontend"""

libraryDependencies ++= Seq(
  // web helpers, see also plugins.sbt
  //"com.typesafe" % "jstranspiler" % "1.0.1",
  // "org.webjars.npm" % "typescript" % "2.6.2",
  //"org.webjars" % "jquery-ui" % "1.12.1",
  //"org.webjars" % "jquery-ui-themes" % "1.12.1",
  // "org.webjars.bower" % "bootstrap-less" % "3.3.4",
  // "org.webjars.npm" % "lit-element" % "2.2.1",
  // "org.webjars.npm" % "lit-html" % "1.1.2",
  // "org.webjars.npm" % "ionic" % "4.10.2",
  // "org.webjars.npm" % "stencil" % "0.0.5",
  // "de.akrebs.testing" % "web-ui-components" % "0.0.1",
  // "org.webjars.npm" % "backbone" % "1.4.0"
  // "org.webjars.npm" % "types__sizzle" % "2.3.2",
  // "org.webjars.npm" % "types__graphql" % "0.9.4",
  // "org.webjars.npm" % "rxjs" % "6.5.4",
  // "org.webjars.npm" % "typescript" % "3.7.5",
  // "org.webjars.npm" % "angular" % "1.7.9"
  // "org.webjars.bower" % "marked" % "0.3.19",
  // "org.webjars" % "react" % "16.5.2"
  // "org.webjars.npm" % "redux" % "4.0.5",
)

JsEngineKeys.engineType := JsEngineKeys.EngineType.Node

pipelineStages := Seq(digest, gzip)

//WebKeys.pipeline := WebKeys.pipeline.dependsOn(webpack.toTask("")).value
// Resolve javascript dependencies in webjars using npm
// resolveFromWebjarsNodeModulesDir := true
//CoffeeScriptKeys.sourceMap := true
