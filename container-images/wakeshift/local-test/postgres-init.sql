-- Two ordinary roles, as Wakeshift requires: an owner that migrates, and a server role that only reads and writes.
CREATE ROLE wakeshift LOGIN PASSWORD 'wakeshift' NOSUPERUSER NOBYPASSRLS CREATEROLE;
CREATE ROLE wakeshift_server LOGIN PASSWORD 'wakeshift_server' NOSUPERUSER NOBYPASSRLS NOCREATEROLE NOCREATEDB;
CREATE DATABASE wakeshift OWNER wakeshift;
