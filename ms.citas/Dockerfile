FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY target/ms.citas-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]