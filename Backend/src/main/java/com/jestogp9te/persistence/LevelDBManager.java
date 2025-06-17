package com.jestogp9te.persistence;

import org.iq80.leveldb.*;
import static org.fusesource.leveldbjni.JniDBFactory.*;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class LevelDBManager {
    private final DB db;

    public LevelDBManager(String dbPath) throws IOException {
        Options options = new Options();
        options.createIfMissing(true);
        db = factory.open(new java.io.File(dbPath), options);
    }

    public void put(String key, byte[] value) {
        db.put(bytes(key), value);
    }

    public byte[] get(String key) {
        return db.get(bytes(key));
    }

    public void delete(String key) {
        db.delete(bytes(key));
    }

    public void close() throws IOException {
        db.close();
    }

    private static byte[] bytes(String str) {
        return str.getBytes(StandardCharsets.UTF_8);
    }
}
