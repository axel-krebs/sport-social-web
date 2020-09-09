organization := "de.akrebs.testing"

name := """sport-social-web"""

version := "1.0-SNAPSHOT"

herokuAppName in Compile := "sport-social-web"
herokuProcessTypes in Compile := Map(
  "web" -> "target/scala-2.12/sport-social-web_2.12-1.0-SNAPSHOT.jar -Dhttp.port=$PORT"
)

lazy val root = (project in file("."))
  .aggregate(frontend,backend)
  .settings(
    update / aggregate := false,
    Compile / run := {
      (frontend / webpack).evaluated
      (backend / Compile / run).evaluated
    }
  )

lazy val frontend = project.in(file("frontend")).enablePlugins(SbtWeb)

lazy val backend = project.in(file("backend"))
  .enablePlugins(PlayScala)
  .enablePlugins(SbtWeb)
  .disablePlugins(SbtWebpack)

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
  "jBCrypt Repository" at "https://repo1.maven.org/maven2/org/"
  //"Local Maven Repository" at "file://C:\\Users/akrebs/.m2/repository"
  //"Axel Krebs Bintray Repository" at "https://dl.bintray.com/axel-krebs/web-ui-components/"
)
