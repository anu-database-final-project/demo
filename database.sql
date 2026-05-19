-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'User' or 'Employee'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Open',
    created_by_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_employee_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create comments table
CREATE TABLE IF NOT EXISTS ticket_comments (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(20) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_by_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sequence for ticket ID generation (e.g. 1001, 1002)
CREATE SEQUENCE IF NOT EXISTS ticket_id_seq START 1001;

-- Seed initial users
INSERT INTO users (id, name, role) VALUES 
(1, 'Ayat', 'User'),
(2, 'Heba', 'User'),
(3, 'Doa''a', 'User'),
(4, 'Ala''a', 'Employee'),
(5, 'Abdullah', 'Employee'),
(6, 'Mustafa', 'Employee')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence for users if needed
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Stored Procedure to create a ticket
CREATE OR REPLACE PROCEDURE sp_create_ticket(
    p_title VARCHAR,
    p_description TEXT,
    p_category VARCHAR,
    p_priority VARCHAR,
    p_created_by_id INT,
    OUT p_new_ticket_id VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    p_new_ticket_id := 'TCK-' || nextval('ticket_id_seq');
    
    INSERT INTO tickets (id, title, description, category, priority, status, created_by_id, created_at, updated_at)
    VALUES (p_new_ticket_id, p_title, p_description, p_category, p_priority, 'Open', p_created_by_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
END;
$$;

-- Stored Procedure to assign a ticket
CREATE OR REPLACE PROCEDURE sp_assign_ticket(
    p_ticket_id VARCHAR,
    p_employee_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE tickets
    SET assigned_employee_id = p_employee_id,
        status = 'In Progress',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_ticket_id;
END;
$$;

-- Stored Procedure to update ticket status
CREATE OR REPLACE PROCEDURE sp_update_ticket_status(
    p_ticket_id VARCHAR,
    p_status VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE tickets
    SET status = p_status,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_ticket_id;
END;
$$;

-- Stored Procedure to add a comment
CREATE OR REPLACE PROCEDURE sp_add_comment(
    p_ticket_id VARCHAR,
    p_message TEXT,
    p_created_by_id INT,
    OUT p_new_comment_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO ticket_comments (ticket_id, message, created_by_id, created_at)
    VALUES (p_ticket_id, p_message, p_created_by_id, CURRENT_TIMESTAMP)
    RETURNING id INTO p_new_comment_id;
    
    -- Update the ticket's updated_at timestamp
    UPDATE tickets
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = p_ticket_id;
END;
$$;

-- Function to get all tickets with their comments
CREATE OR REPLACE FUNCTION fn_get_all_tickets()
RETURNS TABLE (
    id VARCHAR,
    title VARCHAR,
    description TEXT,
    category VARCHAR,
    priority VARCHAR,
    status VARCHAR,
    created_by_id INT,
    created_by_name VARCHAR,
    assigned_employee_id INT,
    assigned_employee_name VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    comments JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id, t.title, t.description, t.category, t.priority, t.status, 
        t.created_by_id, creator.name AS created_by_name, 
        t.assigned_employee_id, assignee.name AS assigned_employee_name, 
        t.created_at, t.updated_at,
        COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'id', c.id,
                        'message', c.message,
                        'createdBy', commenter.name,
                        'createdAt', c.created_at
                    ) ORDER BY c.created_at ASC
                )
                FROM ticket_comments c
                JOIN users commenter ON c.created_by_id = commenter.id
                WHERE c.ticket_id = t.id
            ), 
            '[]'::json
        ) AS comments
    FROM tickets t
    JOIN users creator ON t.created_by_id = creator.id
    LEFT JOIN users assignee ON t.assigned_employee_id = assignee.id
    ORDER BY t.created_at DESC;
END;
$$;
