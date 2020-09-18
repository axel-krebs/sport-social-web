import play.core.PlayVersion.akkaVersion

name := """sport-social-web-backend"""

scalaVersion := "2.12.10"

scalacOptions ++= Seq(
  "-feature",
  "-deprecation",
  "-Xfatal-warnings",
  "-language:_"
)

logLevel := Level.Warn

libraryDependencies ++= Seq(
  "com.typesafe.play" % "play_2.12" % "2.8.0",
  //"org.scala-lang.modules" % "scala-xml_2.12" % "1.0.3",
  //"org.scala-lang.modules" %% "scala-xml" % "1.2.0",
  "org.scalatestplus.play" %% "scalatestplus-play" % "5.0.0" % Test,
  "com.typesafe.akka" %% "akka-slf4j" % akkaVersion,
  "com.typesafe.akka" %% "akka-testkit" % akkaVersion % Test,
  "com.typesafe.akka" %% "akka-stream-testkit" % akkaVersion % Test,
  //"org.slf4j" % "slf4j-nop" % "1.7.30",
  "ch.qos.logback" % "logback-classic" % "1.2.3",
  "net.logstash.logback" % "logstash-logback-encoder" % "6.2",
  guice,
  //"com.google.inject" % "guice" % "2.7.4",
  "com.typesafe.play" %% "play-guice" % "2.7.4" % Test,
  "com.google.guava" % "guava" % "28.1-jre",
  "com.github.ben-manes.caffeine" % "caffeine" % "2.8.2",
  jdbc,
  evolutions,
  "com.typesafe.slick" %% "slick" % "3.3.2",
  "com.typesafe.slick" %% "slick-hikaricp" % "3.3.2",
  "org.postgresql" % "postgresql" % "9.4-1200-jdbc41",
  "org.jsoup" % "jsoup" % "1.12.1",
  "org.webjars" %% "webjars-play" % "2.8.0",
  "org.webjars.npm" % "domutils" % "2.0.0",
  "org.webjars.npm" % "xmldom" % "0.1.31",
  // the following web libs are required before loading the React app
  "org.webjars" % "requirejs" % "2.3.6",
  "org.webjars" % "jquery" % "3.4.1",
  "org.webjars" % "bootstrap" % "4.5.2"
  //"com.adrianhurt" %% "play-bootstrap" % "1.6.1-P28-B4" ScalaJS
  //"org.webjars" % "bootstrap-sass" % "3.4.1" Bootstrap 3
)
