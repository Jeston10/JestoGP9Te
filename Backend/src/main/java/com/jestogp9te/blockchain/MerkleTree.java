package com.jestogp9te.blockchain;

import com.jestogp9te.util.HashUtil;
import java.util.ArrayList;
import java.util.List;

public class MerkleTree {

    public static String getMerkleRoot(List<Transaction> transactions) {
        List<String> hashes = new ArrayList<>();
        for (Transaction tx : transactions) {
            hashes.add(tx.calculateHash());
        }

        while (hashes.size() > 1) {
            List<String> newHashes = new ArrayList<>();
            for (int i = 0; i < hashes.size(); i += 2) {
                String left = hashes.get(i);
                String right = (i + 1 < hashes.size()) ? hashes.get(i + 1) : left;
                newHashes.add(HashUtil.sha256(left + right));
            }
            hashes = newHashes;
        }

        return hashes.size() == 1 ? hashes.get(0) : "";
    }
}
