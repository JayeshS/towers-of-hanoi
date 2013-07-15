var myApp = {};

$(document).ready(function () {

    myApp = (function init() {

        var diskHeight = 25;
        var baseWidth = 300;
        var baseHeight = 10;
        var poleWidth = 20;
        var numberOfDisks = 5;
        var container = $("#container");
        var poles = [];
        var polesMap = {};
        var solutionSteps = [];

        var coords = {
            Src: {x: 100, y: 300},
            Aux: {x: 450, y: 300},
            Dst: {x: 800, y: 300}
        };

        var createArray = function (num) {
            var arr = [];
            for (var i = 0; i < num; i++) {
                arr.push(i + 1);
            }
            return arr;
        };

        function createDisk(opts) {
            var disk = document.createElement("div");
            $(disk)
                .attr('fromPole', opts.fromPole)
                .attr('size', opts.size)
                .addClass('disk')
                .addClass(opts.draggable ? 'draggable' : '')
                .width(opts.width)
                .css({
                    left: opts.left,
                    top: opts.top,
                    height: diskHeight
                })
            ;
            return disk;
        }

        function createBase(opts) {
            var base = document.createElement("div");
            $(base)
                .attr('poleName', opts.name)
                .addClass('base')
                .css(
                {
                    left: opts.left,
                    top: coords.Src.y,
                    height: baseHeight
                })
            ;
            container.append(base);

            var pole = document.createElement("div");
            var poleHeight = poles[0].disks.length * diskHeight + 50;
            $(pole)
                .attr('poleName', opts.name)
                .addClass('pole')
                .addClass('droppable')
                .css({
                    left: opts.left + baseWidth / 2 - poleWidth / 2,
                    top: coords.Src.y - poleHeight,
                    height: poleHeight,
                    width: poleWidth,
                    zIndex: -1
                });
            container.append(pole);
        }

        function initialiseBases() {
            createBase({name: poles[0].name, left: coords.Src.x - baseWidth / 2});
            createBase({name: poles[1].name, left: coords.Aux.x - baseWidth / 2 });
            createBase({name: poles[2].name, left: coords.Dst.x - baseWidth / 2 });
        }

        function draw() {
            $(".disk").remove();
            for (var i = 0; i < poles.length; i++) {
                drawPole(poles[i]);
            }
            initDragDrop();
        }

        function initDragDrop() {
            $(".droppable").droppable({
                accept: ".draggable",
                hoverClass: "ui-state-highlight",
                drop: function (event, elem) {
                    console.info("dropped from " + elem.draggable.attr('fromPole') + ' to ' + $(this).attr('poleName'));
                    move(elem.draggable, $(this));
                    $(".droppable").droppable("enable");
                }
            });
            $('.draggable').draggable({
                cursor: "crosshair",
                start: function (event, elem) {
                    $('.droppable').each(function () {
                        var diskSize = elem.helper.attr('size');
                        var toPole = polesMap[$(this).attr('poleName')];
                        if (!toPole.canAcceptDiskSize(diskSize)) {
                            $(this).droppable("disable");
                        }
                    });
                },
                stop: function (event, elem) {
                    $(".droppable").droppable("enable");
                },
                revert: 'invalid',
                revertDuration: 300
            });

        }

        function poleConstructor(opts) {
            opts.isEmpty = function () {
                return this.disks.length === 0;
            };

            opts.canAcceptDiskSize = function (diskSize) {
                return this.isEmpty() || this.disks[0] > diskSize;
            };
            return opts;
        }

        function initialise() {
            container.empty();
            poles = [
                poleConstructor({name: 'Src', disks: createArray(numberOfDisks) }),
                poleConstructor({name: 'Aux', disks: []}),
                poleConstructor({name: 'Dst', disks: []})
            ];
            for (var i = 0; i < poles.length; i++) {
                polesMap[poles[i].name] = poles[i];
            }
            draw();
            initialiseBases();
            initDragDrop();
            message.hide();
        }

        var message = function () {
            var selector = ".wonMessage";
            return {
                hide: function hideMessages() {
                    $(selector).hide();
                },
                show: function hideMessages() {
                    $(selector).show();
                }

            }
        }();


        function drawPole(pole) {
            for (var i = pole.disks.length; i > 0; i--) {
                var width = 80 + 30 * pole.disks[i - 1];
                container.append(createDisk({
                    fromPole: pole.name,
                    size: pole.disks[i - 1],
                    width: width,
                    left: coords[pole.name].x - width / 2,
                    top: coords[pole.name].y - diskHeight * (pole.disks.length - (i - 1)),
                    draggable: i === 1
                }));
            }
        }

        initialise();

        (function solveIt() {
            function solveToh(src, aux, dest, discNum) {
                if (typeof discNum === 'undefined') {
                    discNum = src.disks.length;
                }

                if (discNum > 0) {
                    solveToh(src, dest, aux, discNum - 1);
                    solutionSteps.push({from: src, to: dest});
                    solveToh(aux, src, dest, discNum - 1);
                }
            }

            solveToh(poles[0], poles[1], poles[2]);

            for (var i = 0; i < solutionSteps.length; i++) {
                console.info("Move from " + solutionSteps[i].from.name + ' to ' + solutionSteps[i].to.name);
            }
        })();

        function move(from, to) {

            var fromPole = polesMap[from.attr('fromPole')];
            var toPole = polesMap[to.attr('poleName')];

            console.log('Move from ' + fromPole.name + ' to ' + toPole.name);
            var disk = fromPole.disks.shift();
            console.log('Adding ' + disk + ' from ' + fromPole.name + ' to ' + toPole.name);
            toPole.disks.unshift(disk);
            draw();

            function checkResult() {
                if (polesMap['Dst'].disks.length === numberOfDisks) {
                    message.show();
                } else {
                    message.hide();
                }
            }

            checkResult();
        }

        return {
            solve: function () {
            },
            reset: function () {
                initialise();
            }
        }

    })();

});