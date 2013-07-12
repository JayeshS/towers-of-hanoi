//var tohModule = angular.module('TowersOfHanoi2', []);

var tohApp = function () {
    var canvasWidth = 1000;
    var baseGap = 25;
    var baseWidth = (canvasWidth - baseGap * 4) / 3;
    var srcPoleCenter = baseGap + baseWidth / 2;
    var auxPoleCenter = srcPoleCenter + baseWidth + baseGap;
    var destPoleCenter = auxPoleCenter + baseWidth + baseGap;
    var startY = 350;
    var baseHeight = 48;
    var baseStrokeWidth = 2;

    var diskLayer = new Kinetic.Layer();
    var stage = new Kinetic.Stage({
        container: 'container',
        width: canvasWidth,
        height: 600
    });
    var poleLayer = new Kinetic.Layer();
    poleLayer.add(createPoleRec({
        x: srcPoleCenter - baseWidth / 2,
        y: startY,
        width: baseWidth,
        height: baseHeight
    }));
    poleLayer.add(createPoleRec({
        x: auxPoleCenter - baseWidth / 2,
        y: startY,
        width: baseWidth,
        height: baseHeight
    }));
    poleLayer.add(createPoleRec({
        x: destPoleCenter - baseWidth / 2,
        y: startY,
        width: baseWidth,
        height: baseHeight
    }));
    stage.add(poleLayer);

    function createPoleRec(opts) {
        return new Kinetic.Rect({
            x: opts.x,
            y: opts.y,
            width: opts.width,
            height: opts.height,
            fill: 'grey',
            stroke: 'black',
            strokeWidth: baseStrokeWidth
        });
    }

    var coords = {
        y: startY - (baseHeight / 2) - baseStrokeWidth * 2,
        Src: {x: srcPoleCenter},
        Aux: {x: auxPoleCenter},
        Dest: {x: srcPoleCenter + 200}
    };

    var createPole = function (name, disks) {
        console.info('creating pole: ' + name);
        return {
            discs: disks,

            getName: function () {
                return name;
            },
            addDisk: function (diskNum) {
                return disks.push(diskNum);
            },
            removeDisk: function () {
                return disks.pop();
            }
        }
    };


    var obj = {
        srcPole: createPole('Src', [1, 2, 3]),
        auxPole: createPole('Aux', []),
        destPole: createPole('Dest', [])

    };

    var draw = function (pole) {
        for (var i = 0; i < pole.discs.length; i++) {
            var width = baseWidth - pole.discs[i] * 20;
            var disk = new Kinetic.Rect({
                x: coords[pole.getName()].x - width / 2,
                y: (coords.y - 30 * i),
                width: width,
                height: 30,
                fill: 'green',
                stroke: 'black',
                strokeWidth: baseStrokeWidth,
                cornerRadius: 5,
                draggable: true
            });
            disk.on('dragstart', function () {
                //                      writeMessage(messageLayer, 'dragstart');
            });
            disk.on('dragend', function () {
                this.setX(auxPoleCenter);
            });
            diskLayer.add(disk);
            stage.add(diskLayer);
        }
    };

    draw(obj.srcPole);

    return obj;
}();


