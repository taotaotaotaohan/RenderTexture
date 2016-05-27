/**
 * Created by taohan on 16/5/26.
 */
var res = {
    bg : "res/247203.jpg",
    dirty : "res/247204.png",
    eraser:"res/247205.png",
    //button:"res/247206.png"
    particle_file:"res/particle.plist",
    great:"res/great.mp3",
};
var guard=[
    {"location":[311,246],
        "tag":0
    },
    {"location":[795,219],
        "tag":0
    },
    {"location":[558,306],
        "tag":0
    },
    {"location":[560,148],
        "tag":0
    },

];

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
