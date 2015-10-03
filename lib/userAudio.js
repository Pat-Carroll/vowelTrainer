

UserAudio = new FS.Collection("userAudio", {
    stores: [new FS.Store.FileSystem("userAudio", {path: "~/Audio/uploads"})]
});

