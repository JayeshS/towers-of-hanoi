package org.js.toh.server;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ResourceHandler;

public class JettyServer {

    public static void main(String[] args) throws Exception {
        checkArgs(args);
        Server server = new Server(8080);
        server.setHandler(createResourceHandler(args[0]));
        server.start();
        server.join();
    }

    private static void checkArgs(String[] args) {
        if (args.length < 1) {
            throw new IllegalArgumentException("Please pass in base path");
        }
    }

    private static ResourceHandler createResourceHandler(String resourceBase) {
        ResourceHandler resourceHandler = new ResourceHandler();
        resourceHandler.setResourceBase(resourceBase);
        return resourceHandler;
    }
}
