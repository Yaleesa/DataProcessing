$("#container1").datamap({
   scope: 'world',
   geography_config: {
     borderColor: 'rgba(255,255,255,0.3)',
     highlightBorderColor: 'rgba(0,0,0,0.5)',
     popupTemplate: _.template([
       '<div class="hoverinfo">',
       '<% if (data.name) { %> <strong><%= data.name %></strong><br/><% } %>',
       '<% if (data.startOfConflict) { %>',
       'Started in <%= data.startOfConflict %><br/> <% } %>',
       '<%= geography.properties.name %>',
       '</div>'
      ].join('') )
   },
   fills: {
     highdensity: '#ff471a',
     medium: '#ffcc66',
     semismalldensity: '#f9f906',
     smalldensity: '#ccff66',
     defaultFill: '#e0e0e0' 
   },
   data: {

     'FRA': {
        fillKey: 'semismalldensity',
        name: 'France',
        density: 118
      },
     'GER': {
     	fillKey: 'medium',
     	name: 'Germany',
     	density: 228
     },
     'SCT': {
     	fillKey: 'medium',
     	name: 'Scotland',
     	density: 262
     },
     'MLI': {
       // fillKey: 'smalldensity',
       name: '2012 Northern Mali conflict',
       density: 300,
       startOfConflict: 2012
      },
     'LBY': {
       // fillKey: 'conflict',
       name: '2011–present Libyan factional fighting',
       density: 200,
       startOfConflict: 2011
      },
     'IRQ': {
       fillKey: 'conflict',
       name: 'Iraqi insurgency (post U.S. withdrawal)',
       startOfConflict: 2011
      },
     'SYR': {
       fillKey: 'conflict',
       name: 'Syrian civil war',
       startOfConflict: 2011
      },
     'SDN': {
       fillKey: 'conflict',
       name: 'Sudan internal conflict',
       startOfConflict: 2011
      },
     'MEX': {
       fillKey: 'conflict',
       name: 'Mexican Drug War',
       startOfConflict: 2006
      },
     'PAK': {
       fillKey: 'conflict',
       name: 'War in North-West Pakistan',
       startOfConflict: 2004
      },
     'YEM': {
       fillKey: 'conflict',
       name: 'Al-Qaeda insurgency in Yemen',
       startOfConflict: 2001
      },
     'MMR': {
       fillKey: 'conflict',
       name: 'Internal conflict in Burma (Myanmar)',
       startOfConflict: 1948
      },
     'COL': {
       fillKey: 'conflict',
       name: 'Colombian conflict',
       startOfConflict: 1964
      },
     'AFG': {
       fillKey: 'conflict',
       name: 'War in Afghanistan',
       startOfConflict: 1978
      }
   }
});

