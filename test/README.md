# testing

We simply run `yarn deduplicate` on each fixture and compare the applied diff
and yarn console output matches the previous snapshot.

Constructing the cases manually requires a lot of work since the files in question
are auto generated anyway (lockfile + pnp file) i.e. I'm probably too lazy to focus
the tests more. Just have to see if the tests are maintainable which means when
the yarn cli is updated snapshots might have to be updated as well even if the behavior
didn't break.

Possible solution might be read the resolved dependencies with `@yarnpkg/core` and
check how those changed. This is more focused but doesn't test what happens after
installing the deduplicated project again (resolve with resolutions, persist pnp. and lockfile)
