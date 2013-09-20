angular.module('ato.lib', [])
    .service('atoThrottle', function($timeout) {


        var setTimeout = $timeout,
            clearTimeout = $timeout.cancel;

        // factorized queuing method

        function queue(f, delay, callAll, invokeApply, debounce) {
            invokeApply = typeof invokeApply === 'boolean' ? invokeApply : true;

            var TO,
                fToCall = [],
                execute = function() {
                    var len = fToCall.length, i=-1;
                    while(++i<len) fToCall[i]();
                    fToCall.length = 0;
                },
                store = function(df) {
                    if(!callAll) fToCall.length = 0;
                    fToCall.push(df);
                },
                toReSchedule,
                schedule = function() {
                    if(TO) clearTimeout(TO);
                    TO = setTimeout(function() {
                        execute();
                        TO = void 0;
                        if(toReSchedule) {
                            toReSchedule = false;
                            schedule();
                        }
                    }, delay, invokeApply);
                },
                enabled = true,
                destroy = function() {
                    if(TO) clearTimeout(TO);
                    enabled = fToCall = destroy = execute = store = schedule = void 0;
                };
            function rf() {
                if(!enabled) return;
                var self = this, args = arguments, hadToReSchedule, delayedF = function() {
                    f.apply(self, args);
                };
                store(delayedF);
                if(TO) {
                    if(debounce) schedule();
                    else hadToReSchedule = toReSchedule = true;
                } else {
                    if(!debounce) execute();
                    schedule();
                }
                return {
                    _cancel: function() {
                        var index = fToCall.indexOf(delayedF);
                        if(~index) {
                            fToCall.splice(index, 1);
                            if(!fToCall.length || hadToReSchedule) toReSchedule = false;
                            return true;
                        } else return false;
                    }
                };
            }
            rf._destroy = destroy;
            return rf;
        }


        // throttle and debounce

        function throttle(f, delay, callLastOnly, invokeApply) {
            return queue(f, delay, callLastOnly, invokeApply, false);
        }
        function debounce(f, delay, callLastOnly, invokeApply) {
            return queue(f, delay, callLastOnly, invokeApply, true);
        }

        this.throttle = throttle;
        this.debounce = debounce;

    });