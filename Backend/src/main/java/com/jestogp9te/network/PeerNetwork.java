package com.jestogp9te.network;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class PeerNetwork {

    private static final Logger logger = LoggerFactory.getLogger(PeerNetwork.class);

    private final Map<String, Peer> peers = new ConcurrentHashMap<>();

    // Add a peer by Peer object
    public void addPeer(Peer peer) {
        peers.put(peer.getId(), peer);
    }

    // Add a peer by string address (creates a Peer with default ID)
    public void addPeer(String address) {
        String id = UUID.randomUUID().toString(); // Generate a unique ID
        String[] parts = address.split(":");
        if (parts.length == 2) {
            String ip = parts[0];
            int port = Integer.parseInt(parts[1]);
            addPeer(new Peer(id, ip, port));
        } else {
            logger.error("Invalid peer address format. Use IP:PORT");
        }
    }

    public void removePeer(String peerId) {
        peers.remove(peerId);
    }

    public Collection<Peer> getAllPeers() {
        return peers.values();
    }

    public Peer getPeer(String id) {
        return peers.get(id);
    }

    public boolean contains(String peerId) {
        return peers.containsKey(peerId);
    }

    public List<String> getPeerAddresses() {
        List<String> addresses = new ArrayList<>();
        for (Peer peer : peers.values()) {
            addresses.add(peer.getIp() + ":" + peer.getPort());
        }
        return addresses;
    }

    public void broadcastMessage(String message) {
        for (Peer peer : peers.values()) {
            // Simulate sending a message
            logger.info("Sending message to {}:{} -> {}", peer.getIp(), peer.getPort(), message);
        }
    }
}
