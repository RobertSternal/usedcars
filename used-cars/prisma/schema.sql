-- Create tables for the car marketplace application

-- User table
CREATE TABLE [User] (
    id NVARCHAR(255) PRIMARY KEY,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    name NVARCHAR(255) NULL,
    phone NVARCHAR(255) NULL,
    profileImage NVARCHAR(255) NULL,
    role NVARCHAR(50) NOT NULL DEFAULT 'USER',
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Car table
CREATE TABLE Car (
    id NVARCHAR(255) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    brand NVARCHAR(255) NOT NULL,
    model NVARCHAR(255) NOT NULL,
    year INT NOT NULL,
    price FLOAT NOT NULL,
    mileage INT NOT NULL,
    fuelType NVARCHAR(50) NOT NULL,
    transmission NVARCHAR(50) NOT NULL,
    bodyType NVARCHAR(50) NOT NULL,
    color NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    location NVARCHAR(255) NOT NULL,
    condition NVARCHAR(50) NOT NULL,
    engineSize FLOAT NULL,
    power INT NULL,
    doors INT NULL,
    seats INT NULL,
    features NVARCHAR(MAX) NULL,
    sellerNotes NVARCHAR(MAX) NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    sellerId NVARCHAR(255) NOT NULL,
    FOREIGN KEY (sellerId) REFERENCES [User](id)
);

-- CarImage table
CREATE TABLE CarImage (
    id NVARCHAR(255) PRIMARY KEY,
    url NVARCHAR(255) NOT NULL,
    isPrimary BIT NOT NULL DEFAULT 0,
    carId NVARCHAR(255) NOT NULL,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (carId) REFERENCES Car(id) ON DELETE CASCADE
);

-- Favorite table
CREATE TABLE Favorite (
    id NVARCHAR(255) PRIMARY KEY,
    userId NVARCHAR(255) NOT NULL,
    carId NVARCHAR(255) NOT NULL,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES [User](id),
    FOREIGN KEY (carId) REFERENCES Car(id) ON DELETE CASCADE,
    CONSTRAINT UQ_Favorite_User_Car UNIQUE (userId, carId)
);

-- Review table
CREATE TABLE Review (
    id NVARCHAR(255) PRIMARY KEY,
    rating INT NOT NULL,
    comment NVARCHAR(MAX) NULL,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    carId NVARCHAR(255) NULL,
    authorId NVARCHAR(255) NOT NULL,
    reviewedUserId NVARCHAR(255) NULL,
    FOREIGN KEY (carId) REFERENCES Car(id) ON DELETE SET NULL,
    FOREIGN KEY (authorId) REFERENCES [User](id),
    FOREIGN KEY (reviewedUserId) REFERENCES [User](id)
);

-- Message table
CREATE TABLE Message (
    id NVARCHAR(255) PRIMARY KEY,
    content NVARCHAR(MAX) NOT NULL,
    isRead BIT NOT NULL DEFAULT 0,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    senderId NVARCHAR(255) NOT NULL,
    recipientId NVARCHAR(255) NOT NULL,
    FOREIGN KEY (senderId) REFERENCES [User](id),
    FOREIGN KEY (recipientId) REFERENCES [User](id)
);

-- Create indexes for better performance
CREATE INDEX IX_Car_SellerId ON Car(sellerId);
CREATE INDEX IX_Car_Brand ON Car(brand);
CREATE INDEX IX_Car_Model ON Car(model);
CREATE INDEX IX_Car_Year ON Car(year);
CREATE INDEX IX_Car_Price ON Car(price);
CREATE INDEX IX_Car_FuelType ON Car(fuelType);
CREATE INDEX IX_Car_Transmission ON Car(transmission);
CREATE INDEX IX_Car_BodyType ON Car(bodyType);
CREATE INDEX IX_Car_Status ON Car(status);

CREATE INDEX IX_CarImage_CarId ON CarImage(carId);
CREATE INDEX IX_Favorite_UserId ON Favorite(userId);
CREATE INDEX IX_Favorite_CarId ON Favorite(carId);
CREATE INDEX IX_Review_CarId ON Review(carId);
CREATE INDEX IX_Review_AuthorId ON Review(authorId);
CREATE INDEX IX_Review_ReviewedUserId ON Review(reviewedUserId);
CREATE INDEX IX_Message_SenderId ON Message(senderId);
CREATE INDEX IX_Message_RecipientId ON Message(recipientId);
