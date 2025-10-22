// 脚本上传sourcemap到sentry
const myoptions = {
    url:'https://sentry.shanghaishulian.com/',
    org:'sentry',
    rewrite: true,
    project:'rest',
    authToken:'9e6681e476a648d6a2ea3a8edab9eb2b9dcff4a53d644737b984baf5ee117e7c',
    include:['./dist'],
    cleanArtifacts:true,
    finalize:true,
    ignore: [ 'node_modules' ],
    release:'rest-use-version'
}
const SentryCli = require('@sentry/cli');
const getSentryCli = ()=> {
    const cli = new SentryCli(myoptions.configFile, {
    //   silent: this.isSilent(),
      org: myoptions.org,
      project: myoptions.project,
      authToken: myoptions.authToken,
      url: myoptions.url,
    //   vcsRemote: myoptions.vcsRemote,
    });

    return cli;
}
const getReleasePromise = ()=> {
    const userSpecifiedRelease = myoptions.release;
    return (userSpecifiedRelease
      ? Promise.resolve(userSpecifiedRelease)
      : mycli.releases.proposeVersion()
    )
      .then(version => `${version}`.trim())
      .catch(() => undefined);
}

const mycli = getSentryCli();
const myrelease = getReleasePromise();
const finalizeRelease = ()=> {
    const {
      include,
    } = myoptions;

    let release;
    return myrelease
      .then(proposedVersion => {
        release = proposedVersion;

        if (!include) {
          throw new Error(`\`include\` option is required`);
        }

        if (!release) {
          throw new Error(
            `Unable to determine version. Make sure to include \`release\` option or use the environment that supports auto-detection https://docs.sentry.io/cli/releases/#creating-releases`
          );
        }

        return mycli.releases.new(release);
      })
      .then(() => {
        if (myoptions.cleanArtifacts) {
          return mycli.releases.execute(
            ['releases', 'files', release, 'delete', '--all'],
            true
          );
        }
        return undefined;
      })
      .then(() => mycli.releases.uploadSourceMaps(release, myoptions))
      .then(() => {
        const {
          commit,
          previousCommit,
          repo,
          auto,
          ignoreMissing,
          ignoreEmpty,
        } = myoptions.setCommits || myoptions;

        if (auto || (repo && commit)) {
          return mycli.releases.setCommits(release, {
            commit,
            previousCommit,
            repo,
            auto,
            ignoreMissing,
            ignoreEmpty,
          });
        }
        return undefined;
      })
      .then(() => {
        if (myoptions.finalize) {
          return mycli.releases.finalize(release);
        }
        return undefined;
      })
      .then(() => {
        const { env, started, finished, time, name, url } =
          myoptions.deploy || {};

        if (env) {
          return mycli.releases.newDeploy(release, {
            env,
            started,
            finished,
            time,
            name,
            url,
          });
        }
        return undefined;
      })
      .catch(err => {

      });
  }

  finalizeRelease()