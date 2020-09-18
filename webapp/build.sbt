name := "sport-social-webapp"

JsEngineKeys.engineType := JsEngineKeys.EngineType.Node

pipelineStages := Seq(digest, gzip)