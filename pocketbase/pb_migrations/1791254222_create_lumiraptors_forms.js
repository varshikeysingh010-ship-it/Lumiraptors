migrate((app) => {
  const definitions = [
    { name: 'early_access', fields: [
      { name: 'email', type: 'email', required: true },
      { name: 'consent', type: 'bool', required: true },
    ], rule: '@request.body.consent = true' },
    { name: 'contact_messages', fields: [
      { name: 'name', type: 'text', required: true, min: 2, max: 120 },
      { name: 'email', type: 'email', required: true },
      { name: 'message', type: 'text', required: true, min: 5, max: 5000 },
    ], rule: '' },
  ];
  for (const definition of definitions) {
    let existing;
    try { existing = app.findCollectionByNameOrId(definition.name); } catch (_) { existing = null; }
    if (existing) continue;
    app.save(new Collection({
      name: definition.name, type: 'base',
      listRule: null, viewRule: null, createRule: definition.rule, updateRule: null, deleteRule: null,
      fields: [...definition.fields,
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    }));
  }
}, (app) => {
  for (const name of ['contact_messages', 'early_access']) {
    app.delete(app.findCollectionByNameOrId(name));
  }
});
