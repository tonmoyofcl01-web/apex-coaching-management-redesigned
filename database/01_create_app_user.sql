-- Run as SYSTEM while connected to the EXISTING target PDB service.
-- Confirm your current container before executing:
-- SELECT SYS_CONTEXT('USERENV', 'CON_NAME') FROM DUAL;
--
-- If APEX_CMS_APP already exists, STOP and inspect it. Do not drop it.
-- Change the password below if your Oracle password profile rejects 109310.

CREATE USER APEX_CMS_APP IDENTIFIED BY "109310";

GRANT CREATE SESSION, CREATE TABLE, CREATE SEQUENCE, CREATE VIEW,
      CREATE PROCEDURE TO APEX_CMS_APP;

ALTER USER APEX_CMS_APP QUOTA UNLIMITED ON USERS;

-- If CREATE USER reports ORA-01920, the username already exists.
-- In that case, do not drop it. Ask your DBA to verify ownership and
-- grant the required privileges to the existing dedicated application user.
