var util = require('util');
var test = require('test');
var os = require('os');
var api = require('subprocess');

var fixture = test.fixture();

fixture.addTest('ps_call_rc', function() {
    var test_cmd = "./subprocess_test_cmd.sh";
    var ps, res;
    ps = api.process();
    res = ps.call_rc(test_cmd);
    test.equal(res, 0);

    test_cmd = "./subprocess_cmd_return_arg.sh";
    res = api.call_rc(test_cmd, ["0", "0"]);
    test.equal(res, 0);
    res = api.call_rc(test_cmd, ["1", "0"]);
    test.equal(res, 1);
    res = api.call_rc(test_cmd, ["0", "1"]);
    test.equal(res, 1);
    res = api.call_rc(test_cmd, ["3", "5"]);
    test.equal(res, 8);

    test.throws(function() {
        api.check_call(test_cmd, ["1", "0"]);
    });
});

fixture.addTest('ps_check_output', function() {
    var test_cmd = "./subprocess_test_cmd.sh";
    var ps, res;
    ps = api.process();
    res = ps.check_output(test_cmd);
    test.equal(res.toString(), "1\n2\n");

    res = api.check_output(test_cmd);
    test.equal(res.toString(), "1\n2\n");
});

fixture.addTest('ps_cwd', function() {
    var ps, res;
    var dir_name = os.mktemp({dir: true});
    test.ok(os.path.isDir(dir_name), "temporary dir?");
    var f1 = os.path(dir_name, "f1");
    os.write_file(f1);
    test.ok(os.path.isFile(f1), "f1 in temporary dir?");

    ps = api.process({cwd: dir_name});
    res = ps.check_output("ls", [dir_name]);
    test.equal(res.toString(), "f1\n");

    os.rmtree(dir_name);
    test.ok(!os.path.isDir(dir_name), "temporary dir is deleted?");

    var dir2 = os.mktemp({dir: true});
    test.ok(os.path.isDir(dir2), "temporary dir2?");
    f2 = os.path(dir2, "f2");
    os.write_file(f2);
    test.ok(os.path.isFile(f2), "f2 in temporary dir?");

    ps = api.process({cwd: dir2});
    res = ps.check_output("ls", [dir2]);
    test.equal(res.toString(), "f2\n");
});

fixture.addTest('write', function() {
    var ps, res;
    ps = api.process();
    res = ps.popen_sync('cat', ['-']);
    res.write('s');
    res.stdin.close();
    res.wait(-1);
    test.equal(res.stdout().toString(), "s");
});

fixture.addTest('wait', function() {
    var ps, res, is_finished;
    ps = api.process();
    res = ps.popen_sync('echo', []);
    is_finished = res.wait(-1);
    test.equal(is_finished, true);
    test.equal(res.error(), undefined);

    ps = api.process();
    res = ps.popen_sync('./non_existing_process', []);
    var is_finished = res.wait(-1);
    test.equal(is_finished, true);
    test.equal(res.error(), "FailedToStart");

});

fixture.addTest('check_error', function() {
    var ps, res, is_finished;

    ps = api.process();
    res = ps.popen_sync('./non_existing_process', []);
    var is_finished = res.wait(-1);
    test.equal(is_finished, true);
    test.throws(res.check_error);
    try {
        res.check_error({info: "more"});
    } catch (e) {
        test.ok("info" in e, util.dump("Error", e));
        test.equal(e.info, "more");
    }

    ps = api.process();
    res = ps.popen_sync('echo', []);
    is_finished = res.wait(-1);
    test.equal(is_finished, true);
    test.equal(res.check_error(), 0);

    ps = api.process();
    res = ps.popen_sync('sleep', [1]);
    is_finished = res.wait(10);
    while (!is_finished)
        is_finished = res.wait(10);
    test.equal(is_finished, true);
    test.equal(res.check_error(), 0);

});

fixture.execute();
