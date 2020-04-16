import play.core.PlayVersion.akkaVersion

organization := "de.akrebs.testing"
logLevel := Level.Warn

lazy val root = (project in file("."))
  .enablePlugins(PlayScala)
  .enablePlugins(SbtWeb)
  .settings(
    name := """sport-social-web""",
    version := "1.0-SNAPSHOT",
    scalaVersion := "2.12.10",
    libraryDependencies ++= Seq(
      "com.typesafe.play" % "play_2.12" % "2.8.0",
      //"org.scala-lang.modules" % "scala-xml_2.12" % "1.0.3",
      //"org.scala-lang.modules" %% "scala-xml" % "1.2.0",
      "org.scalatestplus.play" %% "scalatestplus-play" % "5.0.0" % Test,
      "com.typesafe.akka" %% "akka-slf4j" % akkaVersion,
      "com.typesafe.akka" %% "akka-testkit" % akkaVersion % Test,
      "com.typesafe.akka" %% "akka-stream-testkit" % akkaVersion % Test,
      "org.jsoup" % "jsoup" % "1.12.1",
      "org.slf4j" % "slf4j-nop" % "1.7.30",
      "ch.qos.logback" % "logback-classic" % "1.2.3",
      "net.logstash.logback" % "logstash-logback-encoder" % "6.2",
      guice,
      //"com.google.inject" % "guice" % "2.7.4",
      "com.typesafe.play" %% "play-guice" % "2.7.4" % Test,
      "com.google.guava" % "guava" % "28.1-jre",
      jdbc,
      evolutions,
      "com.typesafe.slick" %% "slick" % "3.3.2",
      "com.typesafe.slick" %% "slick-hikaricp" % "3.3.2",
      "org.postgresql" % "postgresql" % "9.4-1200-jdbc41",
      // web helpers, see also plugins.sbt
      "org.webjars" %% "webjars-play" % "2.8.0",
      "com.typesafe" % "jstranspiler" % "1.0.1",
      //      "org.webjars.npm" % "typescript" % "2.6.2",
      "org.webjars.npm" % "domutils" % "2.0.0",
      "org.webjars.npm" % "xmldom" % "0.1.31",
      //      "org.webjars.bower" % "bootstrap-less" % "3.3.4",
      "org.webjars" % "requirejs" % "2.3.6",
      "org.webjars" % "jquery" % "3.4.1",
      "org.webjars" % "jquery-ui" % "1.12.1",
      "org.webjars" % "jquery-ui-themes" % "1.12.1",
      // "org.webjars.npm" % "lit-element" % "2.2.1",
      // "org.webjars.npm" % "lit-html" % "1.1.2",
      // "org.webjars.npm" % "ionic" % "4.10.2",
      // "org.webjars.npm" % "stencil" % "0.0.5",
      "de.akrebs.testing" % "web-ui-components" % "0.0.1",
      "org.webjars.npm" % "backbone" % "1.4.0"
      // "org.webjars.npm" % "types__sizzle" % "2.3.2",
      // "org.webjars.npm" % "types__graphql" % "0.9.4",
      // "org.webjars.npm" % "rxjs" % "6.5.4",
      // "org.webjars.npm" % "types__react-redux" % "7.1.5"
      // "org.webjars.npm" % "types__react" % "16.9.20",
      // "org.webjars.npm" % "types__prop-types" % "15.7.3"
      // "org.webjars.npm" % "redux" % "4.0.5",
      // "org.webjars.npm" % "typescript" % "3.7.5",
      // "org.webjars.npm" % "angular" % "1.7.9"
    ),
    scalacOptions ++= Seq(
      "-feature",
      "-deprecation",
      "-Xfatal-warnings",
      "-language:_"
    ),
    // Resolve javascript dependencies in webjars using npm
    // resolveFromWebjarsNodeModulesDir := true
    CoffeeScriptKeys.sourceMap := true
  )

JsEngineKeys.engineType := JsEngineKeys.EngineType.Node

//pipelineStages := Seq(digest, gzip)
herokuAppName in Compile := "sport-social-web"
herokuProcessTypes in Compile := Map(
  "web" -> "target/scala-2.12/sport-social-web_2.12-1.0-SNAPSHOT.jar -Dhttp.port=$PORT"
)

resolvers ++= Seq(
  "Typesafe Ivy repository" at "https://repo.typesafe.com/typesafe/ivy-releases/",
  "Typesafe Maven Repository" at "https://repo.typesafe.com/typesafe/maven-releases/",
  "Typesafe Repository" at "https://repo.typesafe.com/typesafe/releases/",
  "Typesafe Snapshots Repository" at "https://repo.typesafe.com/typesafe/snapshots/",
  "Bintray phase-out" at "https://dl.bintray.com/typesafe/maven-releases/", // typesafe old
  "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases", // scalaz streams
  "Bintray IDEA" at "https://dl.bintray.com/jetbrains/sbt-plugins/",
  "Sonatype OSS Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots",
  "Maven Central" at "https://repo1.maven.org/maven2/",
  "jBCrypt Repository" at "https://repo1.maven.org/maven2/org/",
  //"Local Maven Repository" at "file://C:\\Users/akrebs/.m2/repository"
  "Axel Krebs Bintray Repository" at "https://dl.bintray.com/axel-krebs/web-ui-components/"
)

// Adds additional packages into Twirl
//TwirlKeys.templateImports += "de.akrebs.testing.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "de.akrebs.testing.binders._"
