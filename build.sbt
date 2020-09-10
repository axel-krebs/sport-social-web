import com.heroku.sbt.HerokuPlugin.autoImport.herokuProcessTypes
import sbt.Keys.baseDirectory

organization := "de.akrebs.testing"

name := """sport-social-web"""

version := "1.0-SNAPSHOT"

herokuAppName in Compile := "sport-social-web-backend"

herokuProcessTypes in Compile := Map(
  "web" -> "target/universal/stage/bin/sport-social-web-backend -Dhttp.port=$PORT"
)

lazy val distTask = taskKey[Unit]("dist task")

lazy val stageTask = taskKey[Unit]("stage task")

lazy val root = (project in file("."))
  .aggregate(frontend, backend)
  .settings(
    update / aggregate := false,
    Compile / run := {
      (frontend / webpack).evaluated
      (backend / Compile / run).evaluated
    },

    // staged artifacts are in sub-project, but heroku expects them in base directory.
    stageTask := {
      var res = (backend / Compile / stage).value
      IO.copyDirectory(res, baseDirectory.value / "target/universal/stage")
    },

    // equally, re-define Play's dist task to copy ZIP file to root target (obsolete)
    distTask := {
      var res = (backend / Compile / dist).value
      IO.copyFile(res, baseDirectory.value / "target")
    }
  )

lazy val frontend = project.in(file("frontend"))
  .enablePlugins(SbtWeb)
  .settings(
    // settings for frontend only
  )


lazy val backend = project.in(file("backend"))
  .enablePlugins(PlayScala)
  .enablePlugins(SbtWeb)
  .disablePlugins(SbtWebpack)
  .settings(
    trackInternalDependencies := TrackLevel.TrackIfMissing
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
  "jBCrypt Repository" at "https://repo1.maven.org/maven2/org/"
  //"Local Maven Repository" at "file://C:\\Users/akrebs/.m2/repository"
  //"Axel Krebs Bintray Repository" at "https://dl.bintray.com/axel-krebs/web-ui-components/"
)
