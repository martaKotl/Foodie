# Database instalation and configuration:
### Open terminal and use these commands:
```
sudo apt install curl ca-certificates
sudo install -d /usr/share/postgresql-common/pgdg
sudo curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc

. /etc/os-release
sudo sh -c "echo 'deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $VERSION_CODENAME-pgdg main' > /etc/apt/sources.list.d/pgdg.list"

sudo apt update
sudo apt install postgresql-17

sudo -u postgres psql
CREATE DATABASE "Foodie";
ALTER USER postgres WITH PASSWORD 'DB2025';
\q

cp ~/Desktop/Foodie/database/foodie_init.sql /tmp/
sudo -u postgres psql -d Foodie -f /tmp/foodie_init.sql

```

# App instalation steps:
1. Install git
```
sudo apt update
sudo apt install git
```
2. Clone this repository onto your machine:
```
git clone https://github.com/martaKotl/Foodie.git
```
3. Install Java, Maven and Node.js. Set the version of Java you installed to your JAVA_HOME and PATH variables
```
sudo apt update
sudo apt install openjdk-17-jdk
sudo apt install maven
sudo apt install nodejs npm

export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

4. Go into the Foodie/foodie directory and run the commands to build the project
```
mvn clean install
```
6. Go into the Foodie/foodie_frontend and run the command
```
npm install
```

# Starting the project
Run this command in Foodie/foodie directory
```
mvn spring-boot:run
```
Run this command in Foodie/foodie_frontend directory (in a new terminal window)
```
npm start
```
