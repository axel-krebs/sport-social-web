name := """sport-social-web-frontend"""

JsEngineKeys.engineType := JsEngineKeys.EngineType.Node

pipelineStages := Seq(digest, gzip)

//WebKeys.pipeline := WebKeys.pipeline.dependsOn(webpack.toTask("")).value
// Resolve javascript dependencies in webjars using npm
// resolveFromWebjarsNodeModulesDir := true
//CoffeeScriptKeys.sourceMap := true
