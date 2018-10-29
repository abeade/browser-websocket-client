module.exports = {
  "sourceMaps": true,
  "presets": [
    [
      "@babel/preset-env",
      {
        "shippedProposals": true,
        "targets": {
          "browsers": [
            "> 1%",
            "last 2 versions"
          ]
        },
        "debug": false
      }
    ]
  ],
  "plugins": [
    "@babel/plugin-proposal-object-rest-spread"
  ]
}
