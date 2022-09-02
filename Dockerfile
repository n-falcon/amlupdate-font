FROM openjdk:11

ARG HOME=/home/blackdev
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} ${HOME}/app/app.jar

WORKDIR ${HOME}/app
ENTRYPOINT ["java", "-jar", "app.jar"]
