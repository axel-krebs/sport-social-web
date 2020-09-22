import com.heroku.sbt.HerokuPlugin.autoImport.herokuProcessTypes
import sbt.Keys.baseDirectory

organization := "de.akrebs.testing"

name := """sport-social-web"""

version := "1.0-SNAPSHOT"

scalaVersion := "2.12.10"

herokuAppName in Compile := "sport-social-web"

// The Heroku sbt plugin won't use the Procfile
herokuProcessTypes in Compile := Map(
  "web" -> "target/universal/stage/bin/sport-social-web-backend -Dconfig.resource=prod_heroku.conf -Dhttp.port=${PORT} -Ddb.default.driver=org.postgresql.Driver -Ddb.default.url=${DATABASE_URL}"
)

lazy val distTask = taskKey[Unit]("dist task")

lazy val stageTask = taskKey[Unit]("stage task")

lazy val backend = project.in(file("backend"))
  .enablePlugins(PlayScala)
  .enablePlugins(SbtWeb)
  .disablePlugins(SbtWebpack)
  .settings(
    trackInternalDependencies := TrackLevel.TrackIfMissing
  )

lazy val root = (project in file("."))
  .aggregate(backend, frontend)
  .settings(
    update / aggregate := false,
    Compile / run := {
      (backend / Compile / run).evaluated
      (frontend / webpack).evaluated
    },

    // staged artifacts are in sub-project, but Heroku expects them in base directory.
    // Why not defined in sub-project? Because baseDirectory not accessible there..
    stageTask := {
      val res = (backend / Compile / stage).value
      IO.copyDirectory(res, baseDirectory.value / "target/universal/stage")
    },

    // equally, re-define Play's dist task to copy ZIP file to root target (obsolete)
    distTask := {
      val res = (backend / Compile / dist).value
      IO.copyFile(res, baseDirectory.value / "target")
    }
  )

lazy val frontend = project.in(file("frontend"))
  .enablePlugins(SbtWeb)
  .enablePlugins(SbtWebpack)

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
  "Heroku plugin" at "https://dl.bintray.com/heroku/sbt-plugins/"
  //"Local Maven Repository" at "file://C:\\Users/akrebs/.m2/repository"
  //"Axel Krebs Bintray Repository" at "https://dl.bintray.com/axel-krebs/web-ui-components/"
)
