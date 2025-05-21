-- First, create auth users
DO $$
DECLARE
    i INT;
    auth_uid UUID;
    engineer_role_id BIGINT;
    existing_email VARCHAR;
BEGIN
    -- Get engineer role id
    SELECT id INTO engineer_role_id FROM roles WHERE name = 'Engineer';
    
    FOR i IN 1..15 LOOP
        -- Check if user already exists
        SELECT email INTO existing_email
        FROM auth.users
        WHERE email = 'engineer' || i || '@example.com';
        
        IF existing_email IS NULL THEN
            -- Create auth user
            INSERT INTO auth.users (
                instance_id,
                id,
                aud,
                role,
                email,
                encrypted_password,
                email_confirmed_at,
                created_at,
                updated_at,
                confirmation_token,
                email_change,
                email_change_token_new,
                recovery_token
            ) VALUES (
                '00000000-0000-0000-0000-000000000000',
                gen_random_uuid(),
                'authenticated',
                'authenticated',
                'engineer' || i || '@example.com',
                crypt('password123', gen_salt('bf')),
                NOW(),
                NOW(),
                NOW(),
                encode(gen_random_bytes(32), 'hex'),
                '',
                '',
                ''
            )
            RETURNING id INTO auth_uid;

            -- Insert into users table
            INSERT INTO public.users (id, full_name, email, role_id)
            VALUES (
                auth_uid,
                'Engineer ' || i,
                'engineer' || i || '@example.com',
                engineer_role_id
            );
        ELSE
            -- Get the existing user's auth.uid
            SELECT id INTO auth_uid
            FROM auth.users
            WHERE email = 'engineer' || i || '@example.com';
            
            -- Update public.users if needed
            INSERT INTO public.users (id, full_name, email, role_id)
            VALUES (
                auth_uid,
                'Engineer ' || i,
                'engineer' || i || '@example.com',
                engineer_role_id
            )
            ON CONFLICT (id) DO UPDATE
            SET full_name = EXCLUDED.full_name,
                role_id = EXCLUDED.role_id;
        END IF;
    END LOOP;
END $$;

-- Insert sample scores for the current month
WITH engineer_scores AS (
    SELECT 
        u.id as user_id,
        generate_series(
            date_trunc('month', current_date),
            current_date,
            '1 day'::interval
        )::date as score_date
    FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE r.name = 'Engineer'
)
INSERT INTO scores (user_id, score_date, total_score, target_score)
SELECT 
    user_id,
    score_date,
    65 + random() * 25, -- Random score between 65 and 90
    85 -- Target score
FROM engineer_scores
ON CONFLICT DO NOTHING;

-- Insert sample score category values
WITH score_entries AS (
    SELECT 
        s.id as score_id,
        c.id as category_id,
        CASE 
            WHEN c.name = 'Technical Skills' THEN random() * 30
            WHEN c.name = 'Communication' THEN random() * 20
            WHEN c.name = 'Problem Solving' THEN random() * 25
            WHEN c.name = 'Team Collaboration' THEN random() * 15
            WHEN c.name = 'Initiative' THEN random() * 10
        END as score
    FROM scores s
    CROSS JOIN score_categories c
)
INSERT INTO score_category_values (score_id, category_id, score)
SELECT score_id, category_id, score
FROM score_entries
ON CONFLICT DO NOTHING;
