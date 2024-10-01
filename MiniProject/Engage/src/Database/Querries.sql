-- Display all databases
SHOW DATABASES;

-- Create a new database named Engage
CREATE DATABASE Engage;

-- Use the Engage database
USE Engage;

-- Create the Users table
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each user
    Name VARCHAR(100) NOT NULL,             -- User's name
    Email VARCHAR(100) NOT NULL UNIQUE,     -- User's email, must be unique
    Password VARCHAR(100) NOT NULL,         -- User's password
    TeamID INT NOT NULL,                    -- Reference to the team the user belongs to
    RoleName VARCHAR(50) NOT NULL,          -- User's role name
    Level INT NOT NULL,                     -- User's level
    ProfilePicture LONGBLOB                 -- User's profile picture stored as binary data
);

-- Create the Teams table
CREATE TABLE Teams (
    TeamID INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each team
    TeamName VARCHAR(100) NOT NULL,         -- Team's name
    PyramidID INT NOT NULL                  -- Reference to the pyramid the team belongs to
);

-- Create the Pyramid table
CREATE TABLE Pyramid (
    PyramidID INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each pyramid
    PyramidName VARCHAR(100) NOT NULL          -- Pyramid's name
);

-- Add a foreign key constraint to Users table to reference Teams table
ALTER TABLE Users
ADD CONSTRAINT FK_TeamID FOREIGN KEY (TeamID) REFERENCES Teams(TeamID);

-- Add a foreign key constraint to Teams table to reference Pyramid table
ALTER TABLE Teams
ADD CONSTRAINT FK_PyramidID FOREIGN KEY (PyramidID) REFERENCES Pyramid(PyramidID);

-- Insert initial data into Pyramid table
INSERT INTO Pyramid(PyramidName) VALUES
    ('HR'),
    ('Development');

-- Insert initial data into Teams table
INSERT INTO Teams(TeamName, PyramidID) VALUES
    ('Talent Acquisition',1),
    ('Employee Relations',1),
    ('Training and Development',1),
    ('Legal',1),
    ('HR pyramid',1),
    ('IT Operations',2),
    ('Support Team',2),
    ('DevOps',2),
    ('Security',2),
    ('Development Pyramid',2);

-- Insert initial data into Users table
INSERT INTO Users(Name,Email,Password,TeamID,RoleName,Level) VALUES 
    ("Bharat Reddy","bharatreddy.1997@gmail.com","NOT SET",1,"Executive Recruiter",4),
    ("Daniel Atkins","danielatkins.1995@gmail.com","NOT SET",1,"Campus Recruiter",3),
    ("Riley James","rileyjames.1190@gmail.com","NOT SET",1,"Diversity and Inclusion Recruiter",4),
    ("Nethra Naveen","nethranaveen@gmail.com","NOT SET",1,"Talent Acquisition Manager",5),
    ("James Smith","jamessmith@gmail.com","NOT SET",9,"Security Manager",5),
    ("Kelly Whitney","kellywhitney@gmail.com","NOT SET",9,"Incident Response Analyst",4),
    ("Ravi Kumar","ravikumar@gmail.com","NOT SET",9,"Compliance Analyst",3),
    ("Riya Sharma","riyasharma@gmail.com","NOT SET",8,"Devops Engineer",4),
    ("John Doe","johndoe@gmail.com","NOT SET",8,"Release Manager",5),
    ("Rohit Sharma","rohitsharma@gmail.com","NOT SET",5,"HR pyramid head",6),
    ("Jessica Kuan","jessicakuan@gmail.com","NOT SET",10,"Development pyramid head",6);

ALTER TABLE USERS
ADD COLUMN PointsReceived INT NOT NULL DEFAULT 0,
ADD COLUMN PointsToGive INT NOT NULL DEFAULT 100,
ADD COLUMN ProfilePicture BLOB,
ADD COLUMN BrightSpark_Awards INT;

-- Alter Teams
ALTER TABLE Teams
ADD COLUMN OTs INT,
ADD COLUMN ABs INT;

-- Awards adn Recognitions table
CREATE TABLE AwardsRecognitions (
    AR_ID INT AUTO_INCREMENT PRIMARY KEY,
    AR VARCHAR(20),
    Points INT
);

-- CoreValues table
CREATE TABLE CoreValues (
    CoreValueID INT AUTO_INCREMENT PRIMARY KEY,
    CoreValue VARCHAR(20)
);

-- Behaviours table
CREATE TABLE Behaviours (
    BehaviourID INT AUTO_INCREMENT PRIMARY KEY,
    BehaviorName VARCHAR(20),
    UserID INT,
    FOREIGN KEY (UserID) REFERENCES USERS(userID)
);

-- Posts table
CREATE TABLE posts (
    postid INT AUTO_INCREMENT PRIMARY KEY,
    recognizerID INT,
    PostString VARCHAR(200),
    PostDate timestamp ,
    CoreValueID INT,
    AwardValueID INT,
	PostPicture BLOB,
    PostType varchar(200),
	FOREIGN KEY (recognizerID) REFERENCES USERS(userID),
    FOREIGN KEY (CoreValueID) REFERENCES CoreValues(CoreValueID),
    FOREIGN KEY (AwardValueID) REFERENCES awardsrecognitions(AR_ID)
);

-- Award and Recognition Behaviours table
CREATE TABLE ARBehaviours (
    PostID INT,
    BehaviorID INT,
    FOREIGN KEY (PostID) REFERENCES posts(postid),
    FOREIGN KEY (BehaviorID) REFERENCES Behaviours(BehaviourID)
);

-- Recognizees table
CREATE TABLE Recognizees (
    PostID INT,
    UserID INT,
    FOREIGN KEY (PostID) REFERENCES posts(postid),
    FOREIGN KEY (UserID) REFERENCES USERS(userID)
    );


-- Insert into Awards table
INSERT INTO awardsrecognitions (AR, Points) VALUES
('Bright Spark', 500),
('Above and Beyond', 1000),
('One Team', 1000),
('Recognition', 20);

-- Insert into CoreValues table
INSERT INTO CoreValues (CoreValue) VALUES
('Agility'),
('One Team'),
('Efficiency'),
('Accuracy');

-- Insert into Behaviours table
INSERT INTO Behaviours (BehaviorName) VALUES
('Collaborative'),
('Inclusive'),
('Accountable'),
('Proactive'),
('Communication'),
('Support'),
('Innovative');

-- Drop database Engage
DROP DATABASE Engage;
