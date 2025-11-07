USE kitabghar;

-- =========================
-- Insert an Admin User
-- =========================
INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Admin', 'admin@kitabghar.com', '$2b$10$uX9WfD6XnR3pFqN1YJp5eeV3b5.DQvHq1/4ySvFZ6sV.zK8FYl2mS', 'admin')
ON DUPLICATE KEY UPDATE email = email;

-- Note: The above hash corresponds to password "admin123"

-- =========================
-- Insert Sample Books
-- =========================
INSERT INTO books (title, author, description, file_path, uploaded_by)
VALUES
  ('DevOps for Beginners', 'Sudip Ghosh', 'Learn the foundations of DevOps, CI/CD, and automation.', '/uploads/devops-beginners.pdf', 1),
  ('Modern Web Deployment', 'KitabGhar Team', 'A complete guide to deploying React & Node apps using Docker.', '/uploads/deploy-guide.pdf', 1)
ON DUPLICATE KEY UPDATE title = title;

-- =========================
-- Insert Sample Favorite
-- =========================
INSERT INTO favorites (user_id, book_id)
VALUES (1, 1)
ON DUPLICATE KEY UPDATE book_id = book_id;
