-- Migration number: 001 	 2025-12-18
CREATE TABLE
    IF NOT EXISTS map (
        reportid INTEGER PRIMARY KEY NOT NULL,
        session TEXT NOT NULL,
        geohash TEXT NOT NULL,
        -- page 0
        page INTEGER,
        uid TEXT NOT NULL, -- required for one report per session constraint
        uiddesc TEXT,
        artclass INTEGER,
        artdesc TEXT,
        geo TEXT,
        district TEXT,
        -- page 1
        dedesignate INTEGER,-- boolean
        description TEXT,
        pattern INTEGER, -- boolean
        localtraffic INTEGER, -- boolean
        reporterlivesnearby INTEGER, -- boolean
        reporterfrequents INTEGER, -- boolean
        reportercontact TEXT, -- TODO: Update this to be on the email table
        -- page 2
        badusageroute TEXT,
        solution TEXT,
        -- constraints
        UNIQUE (session, uid) ON CONFLICT REPLACE
    ) STRICT;

-- TODO: Update this to be a list of reports for an email
CREATE TABLE
    IF NOT EXISTS email (
        session TEXT NOT NULL,
        uid TEXT NOT NULL,
        email TEXT NOT NULL,
        PRIMARY KEY (session, uid)
        UNIQUE (session, uid) ON CONFLICT REPLACE
    ) STRICT;

CREATE INDEX IF NOT EXISTS geo ON map(geohash);
CREATE INDEX IF NOT EXISTS uidsession ON map(uid, session);