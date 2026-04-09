-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema railway
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `railway` DEFAULT CHARACTER SET utf8 ;
USE `railway` ;

-- -----------------------------------------------------
-- Table `railway`.`Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `railway`.`Users` (
  `UserID` INT NOT NULL AUTO_INCREMENT,
  `Username` VARCHAR(50) NOT NULL,
  `Email` VARCHAR(255) NOT NULL,
  `PasswordHash` VARCHAR(255) NOT NULL,
  `Role` ENUM('uploader', 'admin') NOT NULL DEFAULT 'uploader',
  `LoginAttempts` INT NOT NULL DEFAULT 0,
  `LockUntil` TIMESTAMP NULL DEFAULT NULL,
  `CreatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  UNIQUE INDEX `Username_UNIQUE` (`Username` ASC) VISIBLE,
  UNIQUE INDEX `Email_UNIQUE` (`Email` ASC) VISIBLE
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `railway`.`Files`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `railway`.`Files` (
  `FileID` INT NOT NULL AUTO_INCREMENT,
  `UserID` INT NOT NULL,
  `StoredName` VARCHAR(255) NOT NULL,
  `OrigName` VARCHAR(255) NOT NULL,
  `MimeType` VARCHAR(100) NOT NULL,
  `Size` INT NOT NULL,
  `UploadedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`FileID`),
  INDEX `UserID_idx` (`UserID` ASC) VISIBLE,
  CONSTRAINT `fk_Files_Users`
    FOREIGN KEY (`UserID`)
    REFERENCES `railway`.`Users` (`UserID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
