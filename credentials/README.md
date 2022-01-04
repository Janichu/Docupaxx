# Credentials Folder

## The purpose of this folder is to store all credentials needed to log into your server and databases. This is important for many reasons. But the two most important reasons is
    1. Grading , servers and databases will be logged into to check code and functionality of application. Not changes will be unless directed and coordinated with the team.
    2. Help. If a class TA or class CTO needs to help a team with an issue, this folder will help facilitate this giving the TA or CTO all needed info AND instructions for logging into your team's server. 


# Below is a list of items required. Missing items will causes points to be deducted from multiple milestone submissions.

1. Server URL or IP
2. SSH username
3. SSH password or key.
    <br> If a ssh key is used please upload the key to the credentials folder.
4. Database URL or IP and port used.
    <br><strong> NOTE THIS DOES NOT MEAN YOUR DATABASE NEEDS A PUBLIC FACING PORT.</strong> But knowing the IP and port number will help with SSH tunneling into the database. The default port is more than sufficient for this class.
5. Database username
6. Database password
7. Database name (basically the name that contains all your tables)
8. Instructions on how to use the above information.
                                                                         
|   Item                   |      Credential                                                  |
| :-----------------------:| :---------------------------------------------------------------:|
| Server IP                |  18.144.82.140                                                   |
| SSH IP                   |  18.144.82.140                                                   |
| SSH Username             |  ubuntu                                                          |
| SSH Key                  |  credentials/SfsuSpring2021CS648Team7KeyPair.pem                 |
| Database IP and Port     |  database-1.chqapgcmnusy.us-west-1.rds.amazonaws.com:3306        |
| Database Username        |  admin                                                           |
| Database Password        |  DocupaxxTeam7#                                                  |
| Database Name            |  team7database                                                   |

# Instructions

## Connecting with SSH to the EC2 Instance

1) Go to credentials folder
2) Run "chmod 400 SfsuSpring2021CS648Team7KeyPair.pem"
3) Run "ssh -i "SfsuSpring2021CS648Team7KeyPair.pem" ubuntu@ec2-18-144-82-140.us-west-1.compute.amazonaws.com"

## Remotely Connecting to MySQL with MySQL Workbench

1)  Open MySQL Workbench
2)  Open Window to add Connection
3)  Select Connect by Standard(TCP/IP)
4)  Fill in Hostname with Database URL
5)  Fill in Port with 3306
6)  Fill in Username with admin
7)  Store password in keychain with Database Password
8)  You are ready to connect to the database

## Additional Information

A database was not created for M0 (approved by email).

# Most important things to Remember
## These values need to kept update to date throughout the semester. <br>
## <strong>Failure to do so will result it points be deducted from milestone submissions.</strong><br>
## You may store the most of the above in this README.md file. DO NOT Store the SSH key or any keys in this README.md file.
