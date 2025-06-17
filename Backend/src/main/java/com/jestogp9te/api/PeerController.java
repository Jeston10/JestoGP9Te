package com.jestogp9te.api;

import com.jestogp9te.network.PeerNetwork;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/peer")
public class PeerController {

    private final PeerNetwork network;

    public PeerController(PeerNetwork network) {
        this.network = network;
    }

    @GetMapping("/list")
    public List<String> getPeers() {
        return network.getPeerAddresses();
    }

    @PostMapping("/add")
    public String addPeer(@RequestParam String address) {
        network.addPeer(address);
        return "Peer added";
    }
}
