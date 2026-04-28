# Expected Request and Response Formats

## Authentication

This API uses **JWT (JSON Web Tokens)** for authentication.

### How it works:

* After login, the server returns a token
* The token must be included in every request

### Header format:

```
Authorization: Bearer <token>
```

### Errors:

```json
{
  "message": "No token provided"
}
```

```json
{
  "message": "Invalid token"
}
```

---

# File Object Structure

```json
{
  "_id": "fileId",
  "originalName": "example.pdf",
  "storedName": "uuid.pdf",
  "uploadedBy": "userId",
  "size": 12345,
  "mimeType": "application/pdf",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

# API Endpoints

---

## Upload File

**POST** `/api/files/upload`

### Authentication:

Required

### Request:

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body:**

* `file` (required)

### Validation:

* Max size: **5MB**
* Allowed types:

  * PDF
  * PNG
  * JPEG
  * DOCX

### Response:

```json
{
  "message": "File uploaded securely",
  "file": { ...FileObject }
}
```

### Error:

```json
{
  "message": "Upload failed"
}
```

---

## Get User Files

**GET** `/api/files`

### Authentication:

Required

### Response:

```json
[
  { ...FileObject }
]
```

> Returns only files uploaded by the authenticated user.

---

## Download File

**GET** `/api/files/:id`

### Authentication:

Required

### Request:

* URL parameter: `id`

### Response:

* File download (binary)

### Errors:

```json
{
  "message": "File not found"
}
```

// Note:

* Ownership check is **not enforced** in this endpoint (potential security limitation)

---

## Delete File

**DELETE** `/api/files/:id`

### Authentication:

Required

### Request:

* URL parameter: `id`

### Authorization:

* Allowed if:

  * User is the file owner
  * OR user role is `admin`

### Response:

```json
{
  "message": "File deleted successfully"
}
```

### Error:

```json
{
  "message": "Unauthorized"
}
```
