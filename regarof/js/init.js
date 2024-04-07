$(function() {
	var RATIO = 100;
	var SPEED = 300;
	var SLIDE = 150;

	const rarityColours = {
		"common": "#ccc",
		"uncommon": "#6699ff",
		"rare": "#ff9933",
		"ultra rare": "#ff66ff"
	}

	class Box {
		constructor(props) {
			let propsArr = Object.keys(props);
			propsArr.forEach(key => {
				this[key] = props[key];
			});

			this.baseItem = props;
			this.showAge = props.showAge ? props.showAge : false;
			this.age = 0;
			this.counter = 0;
		}

		returnIconDOM() {
			let $icon = $('<div>').addClass('icon');
			const bx = -this.source[1]*RATIO;
			const by = -this.source[0]*RATIO;
			const pos = bx + '% ' + by + '%';
			$icon.css({
				backgroundPosition: pos
			});
			$icon.attr('id', this.id);
			//$icon.text(this.formatted);
			let $interest = $('<div>').addClass('golden').text(this.interest);
			let $sell = $('<div>').addClass('red').text(this.sell);
			let $age = $('<div>').addClass('red').text(this.age);
			let $counter = $('<div>').addClass('purple').text(this.counter);
			//$icon.append($interest);
			//$icon.append($sell);

			if (this.showAge) {
				$icon.append($age);
			}
			if (this.counter > 0) {
				$icon.append($counter);
			}

			return $icon;
		}

		returnHoverDOM(data) {
			let $info = $('<div>').addClass('info');

			let $iconCover = $('<div>').addClass('iconCover');
			$iconCover.append(this.returnIconDOM());
			$info.append($iconCover);

			$info.append($('<div>').text(this.formatted));
			$info.append($('<div>').text('[' + this.rarity + ']'));
			let interestPrep = this.baseItem.interest !== this.interest ? this.baseItem.interest + ' -> ' : '';
			let sellPrep = this.baseItem.interest !== this.interest ? this.baseItem.interest + ' -> ' : '';
			$info.append($('<div>').text('Interest: ' + interestPrep + this.interest));
			$info.append($('<div>').text('Sell: ' + sellPrep + this.sell));
			$info.append($('<div>').text(this.effect));

			$info.css({
				backgroundColor: rarityColours[this.rarity]
			});
			return $info;
		}
	}
	
	class Map {
		constructor() {
			this.cycle = 0;
			this.gold = 0;
			this.rentDue = this.getRent();
			this.timeUntilNext = 5;
			this.rerollTokens = 1;

			this.arr = [];
			this.size = 9;
			for (let i = 0; i < this.size; i++) {
				this.arr.push(null);
			}
		}

		getNeighbourIndexes(index, showNullSpots = false) {
			const rows = 3;
			const cols = 3;
			const row = Math.floor(index / cols);
			const col = index % cols;

			const neighbors = [];

			// Loop through neighboring cells
			for (let i = row - 1; i <= row + 1; i++) {
				for (let j = col - 1; j <= col + 1; j++) {
					// Check if the index is within bounds
					if (i >= 0 && i < rows && j >= 0 && j < cols) {
						// Convert 2D coordinates to 1D index
						const neighborIndex = i * cols + j;
						// Add the index to the array if it's not the original index
						if (showNullSpots || this.arr[neighborIndex] !== null) {
							if (neighborIndex !== index) {
								neighbors.push(neighborIndex);
							}
						}						
					}
				}
			}

			return neighbors;
		}
	
		forage(data) {
			const { items } = data;

			$('#options').html('');

			let chosenItems = [];
			for (let i = 0; i < 3; i++) {
				const r = randInt(0, items.length-1);
				const item = items[r];

				if (chosenItems.indexOf(item.id) !== -1) {
					i--;
					continue;
				}
				chosenItems.push(item.id);

				const itemBox = new Box(item);
				let $choice = $('<div>').addClass('choice');
				$choice.append(itemBox.returnHoverDOM());
				$choice.css({
					backgroundColor: rarityColours[item.rarity]
				});
				$('#options').append($choice);
			}

			$('#choiceModal').slideDown(SLIDE);
		}

		add(obj, pos = -1) {
			let isMapFull = this.arr.every(item => item !== null);

			if (!isMapFull) {
				while (!isMapFull) {
					let r = randInt(0, this.arr.length-1);
					if (pos !== -1) r = pos;
					if (pos !== -1 || this.arr[r] === null) {
						this.arr[r] = new Box(obj);
						this.updateMap();
						isMapFull = true;
					}
				}
			} else {
				// Sells item instead
				this.gold += obj.sell;
			}

			// EXTRA
			// Make sages stronger
			this.arr.forEach(item => {
				if (item === null) return;
				if (item.id === 'sage') {
					item.sell++;
					console.log('sage got stronger '+item.sell);
				}
			});
		}

		displayCoin(pos, amount) {
			$('#map .box').eq(pos).find('.displayCoin').remove();
			let $display = $('<div>').addClass('displayCoin rise');
			let $icon = $('<div>').addClass('icon coin');
			let $number = $('<div>').addClass('number').text('$'+amount);
			$display.append($icon);
			$display.append($number);
			if (amount > 0) $('#map .box').eq(pos).append($display);
			$('#map .box').eq(pos).addClass('shake');
		}

		effectThrough(data) {
			const { items } = data;

			// Reset interest and sell price for everything
			this.arr.forEach(item => {
				if (item === null) return;
				let baseItem = searchById(items, item.id);
				item.interest = baseItem.interest;
				item.sell = baseItem.sell;
			});

			for (let i = 0; i < this.size; i++) {
				let item = this.arr[i];
				if (item === null) continue;

				item.age++;

				let EFFECT = {
					"dark_berries": () => {
						let neighbours = this.getNeighbourIndexes(i);
						neighbours.forEach(n => {
							let nItem = this.arr[n];
							if (nItem.tags.indexOf('berry') !== -1) {
								nItem.interest = nItem.interest*2;
							}
						});
					},
					"red_berries": () => {
						let neighbours = this.getNeighbourIndexes(i);
						neighbours.forEach(n => {
							let nItem = this.arr[n];
							if (nItem.tags.indexOf('berry') !== -1) {
								nItem.interest = nItem.interest + 1;
							}
						});
					},
					"leaves": () => {
						item.interest = item.age;
						if (Math.random() < 0.10) {
							this.arr[i] = null;
						}
					},
					"twigs": () => {
						let neighbours = this.getNeighbourIndexes(i);
						neighbours.forEach(n => {
							let nItem = this.arr[n];
							if (nItem.id !== item.id) {
								item.interest++;
							}
						});
					},
					"tree_bark": () => {
						if (item.age >= 3) {
							this.arr[i] = null;
							this.gold += 10; // TODO no displayCoin
						}
					},
					"cornflower": () => {
						if (item.age >= 5) {
							item.interest = item.interest*5;
						}
					},
					"milkcap": () => {
						let neighbours = this.getNeighbourIndexes(i);
						neighbours.forEach(n => {
							let nItem = this.arr[n];
							let hasOccurred = false;
							if (Math.random() < 0.25 && !hasOccurred) {
								nItem.interest = 0;
								hasOccurred = true;
							}
						});
					},
					"sharp_rock": () => {
						let neighbours = this.getNeighbourIndexes(i);
						neighbours.forEach(n => {
							let nItem = this.arr[n];
							if (nItem.id === item.id) {
								item.interest += 3;
							}
						});
					},
					"marigold": () => {
						if (Math.random() < 0.1) {
							item.sell = item.sell*5; // TODO will reset after turn
						}
					},
					"dandelion": () => {
						if (Math.random() < 0.5) {
							this.gold = Math.round(this.gold/2);
						} else {
							this.gold = Math.round(this.gold*2);
						}
					},
					"prickly_pear": () => {
						let neighbours = this.getNeighbourIndexes(i);
						neighbours.forEach(n => {
							let nItem = this.arr[n];
							this.gold += nItem.sell*5;
							this.arr[n] = null;
						});
						this.arr[i] = null;
					},
					"poppy": () => {
						if (Math.random() < 0.25) {
							let neighbours = this.getNeighbourIndexes(i, true);
							let pos = rand(neighbours);
							this.add(item, pos);
						}
					},
					"flint": () => {
						let all = this.getNeighbourIndexes(i, true);
						let occupied = this.getNeighbourIndexes(i);
						let empty = all.length - occupied.length;
						item.interest = item.interest*empty;
					},
					"gold_shard": () => {
						let neighbours = this.getNeighbourIndexes(i);
						neighbours.forEach(n => {
							let nItem = this.arr[n];
							nItem.interest = nItem.interest*2;
						});
					},
					"bones": () => {
						let neighbours = this.getNeighbourIndexes(i);
						neighbours.forEach(n => {
							let nItem = this.arr[n];
							if (nItem.tags.indexOf('flower') !== -1) {
								this.arr[n] = null;
								item.interest++;
							}
						});
					},
					"orange_berries": () => {
						let count = 0;
						this.arr.forEach(item => {
							if (item === null) return;
							if (item.tags.indexOf('berry') !== -1) {
								count++;
							}
						});
						this.arr.forEach(item => {
							if (item === null) return;
							if (item.tags.indexOf('berry') !== -1) {
								item.interest += count;
							}
						});
					},
					"daylily": () => {
						item.interest = Math.floor(this.gold / 10);
					},
					"amber": () => {
						for (let z = 0; z < item.age; z++) {
							item.interest += Math.random() < 0.5 ? -1 : 1;
						}
					},
					"wood_moss": () => {
						if (item.age % 2 == 0) {
							let temp = item.interest;
							item.interest = item.sell;
							item.sell = temp;
						}
					},
					"purple_berries": () => {
						if (
							i === 0 ||
							i === 2 ||
							i === 6 ||
							i === 8
						) {
							item.interest = item.interest*2;
						}
					},
					"thistle": () => {
						if (i === 4) {
							item.interest = item.interest*4;
						}
					},
					"toadflax": () => {
						if (Math.random() < 0.5) {
							this.rerollTokens++;
						}
					},
					"roots": () => {
						if (i >= 6) {
							item.interest = item.interest*3;
						}
					},
					"woolly_mullein": () => {
						let neighbours = this.getNeighbourIndexes(4);
						if (this.arr[4] !== null) neighbours.push(4);
						let r = rand(neighbours);
						let rItem = this.arr[r];
						this.arr[r] = null;
						this.add(rItem);
					},
					"pebbles": () => {
						let found = {
							tree: false,
							abiotic: false,
							flower: false
						}
						this.arr.forEach(item => {
							if (item === null) return;
							if (item.tags.indexOf('tree') !== -1) found.tree = true;
							if (item.tags.indexOf('abiotic') !== -1) found.abiotic = true;
							if (item.tags.indexOf('flower') !== -1) found.flower = true;
						});

						if (found.tree && found.abiotic && found.flower) {
							item.interest = item.interest*2;
						}
					},
					"light_berries": () => {
						const berries = [
							"blue_berries",
							"dark_berries",
							"red_berries",
							"orange_berries",
							"purple_berries",
							"light_berries"
						];
						let item = searchById(items, rand(berries));
						let neighbours = this.getNeighbourIndexes(4);
						if (this.arr[4] !== null) neighbours.push(4);
						let r = rand(neighbours);
						this.arr[r] = new Box(item);
					},
					"chanterelle": () => {
						let neighbours = this.getNeighbourIndexes(i);
						neighbours.forEach(n => {
							let nItem = this.arr[n];
							nItem.sell = nItem.sell*2;
						});
					},
					"gem_shard": () => {
						this.arr.forEach(item => {
							if (item === null) return;
							if (item.tags.indexOf('abiotic') !== -1) {
								item.interest += 1;
							}
						});
					},
					"obsidian": () => {
						let counter = 0;
						this.arr.forEach(item => {
							if (item === null) counter++;
						});

						this.arr.forEach(item => {
							if (item === null) return;
							item.interest = Math.floor(item.interest * counter/2);
						});
					},
					"penny_bun": () => {
						const occupied = this.getNeighbourIndexes(i);
						const r = rand(occupied);
						const rarityArr = Object.keys(rarityColours);
						let index = rarityArr.indexOf(item.rarity);
						if (index+1 <= rarityArr.length-1) index++;
						const newRarity = rarityArr[index];
						console.log('new rarity chosen. current: ' + item.rarity + ' (' + item.formatted + ') new: ' + newRarity);
						const availableItems = items.filter(obj => obj.rarity === newRarity);
						console.log('available items: ' + availableItems.length);
						const chosenItem = rand(availableItems);
						this.arr[r] = new Box(chosenItem);
						console.log(chosenItem.formatted + ' placed at ' + r); // TODO check this works
					},
					"acorn": () => {
						let count = 0;
						this.arr.forEach(item => {
							if (item === null) return;
							if (item.tags.indexOf('tree') !== -1) {
								count++;
							}
						});

						item.interest = count;
					},
					"green_berries": () => {
						if (i === 2 || i === 5 || i == 8) {
							item.interest = item.interest*2;
						}
					},
					"mint": () => {
						if (i === 0 || i === 3 || i == 6) {
							item.interest = item.interest*2;
						}
					},
					"tooth": () => {
						if (item.age % 3 === 0) {
							this.gold += 5;
						}
					},
					"azalea": () => {
						if (item.age % 2 === 0) {
							this.gold += 3;
						}
					},
					"daisy": () => {
						let neighbours = this.getNeighbourIndexes(i);
						let rockNeighbours = neighbours.filter(index => this.arr[index].tags.includes('abiotic'));

						if (Math.random() < 0.25) {
							const pos = rand(rockNeighbours);
							const poppy = searchById(items, 'poppy');
							this.arr[pos] = new Box(poppy);
						}
					},
					"opium": () => {
						item.sell = 1 + item.age;

						if (Math.random() < 0.01) {
							this.arr[i] = null;
						}
					},
					"circle_stone": () => {
						if (Math.random() < 0.05) {
							item.counter++;
						}
						item.interest = item.interest + item.counter;
						item.sell = item.sell + item.counter;
					},
					"sage": () => {
						item.sell = 1 + item.counter;
					},
					"lavender": () => {
						item.interest = 1 + item.counter;
					},
					"smooth_stone": () => {
						for (let i = 0; i < this.arr.length; i++) {
							if (this.arr[i] === null) continue;
							if (this.arr[i].tags.includes('berry')) {
								let s_r_item = searchById(items, 'sharp_rock');
								this.arr[i] = new Box(s_r_item);
							}
						}
					},
					"buttercup": () => {
						item.interest = item.interest + Math.floor(item.age / 5);
					},
					"fly_agaric": () => {
						let occupied = this.getNeighbourIndexes(i);
						for (let i = 0; i < occupied.length; i++) {
							this.arr[occupied[i]] = null;
							item.counter += 5;
						}
						item.interest = 1 + item.counter;
					}
				}

				const effectFunction = EFFECT[item.id];
				if (effectFunction) {
					effectFunction(i);
				} else {
					// No effect
				}

				this.updateMap();
			}
		}

		runThrough() {
			let count = SLIDE;
			for (let i = 0; i < this.size; i++) {
				if (this.arr[i] !== null) {
					let item = this.arr[i];

					setTimeout(() => {
						this.gold += item.interest;
						this.displayCoin(i, item.interest);
						this.updateValues();
					}, count);
					
					count += SPEED;
				}
			}
		}
	
		updateMap() {
			// Map
			$('#map').html('');
			for (let i = 0; i < this.size; i++) {
				let $box = $('<div>').addClass('box');
				if (this.arr[i] !== null) {
					$box.addClass('hoverable');
					$box.append(this.arr[i].returnIconDOM());
				}
				$('#map').append($box);
			}
		}

		updateValues() {
			$('.cycle').text(this.cycle);
			$('.gold').text(this.gold);
			$('.rentDue').text(this.rentDue);
			$('.rerollTokens').text(this.rerollTokens);
			$('#reroll').attr('disabled', this.rerollTokens <= 0);
			if (this.timeUntilNext <= 0) {
				$('.timeUntilNext').text('');
			} else {
				$('.timeUntilNext').text('in ' + this.timeUntilNext + ' turns');
			}
			$('#payRent').attr('disabled', this.gold < this.rentDue);
		}

		getRent() {
			let c = this.cycle > 0 ? this.cycle : 1;
			return Math.round(10 * Math.pow(c, 1.5));
		}
	}

	const searchById = (array, id) => {
		return array.find(obj => obj.id === id);
	}

	$.getJSON("data.json", function(data) {
		$('#loading').hide();

		const { items } = data;

		console.log("There are " + items.length + " items.");

		let map = new Map();

		map.updateMap();
		map.updateValues();

		$('#forage').on('click', function() {
			map.forage(data);
		});

		$('#reroll').on('click', function() {
			map.forage(data);
			map.rerollTokens--;
			map.updateValues();
		});

		$('#payRent').on('click', function() {
			if (map.gold >= map.rentDue) {
				map.gold -= map.rentDue; // Subtract rent
				map.timeUntilNext = 5; // Reset timer
				map.rentDue = map.getRent(); // Recalculate rent
				map.updateValues();
				$('#payRent').hide();
				$('#forage').show();
			}
		});

		$('#map').on('click', '.box', function() {
			const index = $(this).index();
			const item = map.arr[index];

			if (item === null) return;

			map.gold += item.sell;
			map.displayCoin(index, item.sell);
			map.updateValues();

			map.arr.splice(index, 1, null);
			$(this).find('#' + item.id).remove();
			$(this).removeClass('hoverable');
			$('#hover').hide();

			// EXTRA
			// Make lavenders stronger
			this.arr.forEach(item => {
				if (item === null) return;
				if (item.id === 'lavender') {
					item.counter++;
					console.log('lavender got stronger '+item.counter);
				}
			});
		});

		$('#choiceModal').on('click', '.choice', function() {
			const itemId = $(this).find('.icon').attr('id');
			const item = searchById(items, itemId);

			map.add(item);

			$('#choiceModal').slideUp(SLIDE);
			map.effectThrough(data);
			map.runThrough(); // Everything happens!
			map.cycle++;
			map.timeUntilNext--;
			if (map.timeUntilNext <= 0) {
				$('#payRent').show();
				$('#forage').hide();
			}

			map.updateValues(); // Update all values at the end
		});
    
	    $(document).mousemove(function(event) {
			$('#hover').css({
				'left': event.pageX,
				'top': event.pageY
			});
		});
	
		$(document).on('mouseenter', '#map .box .icon', function() {
			const index = $(this).parent().index();
			$('#hover').html(map.arr[index].returnHoverDOM());
			$('#hover').show();
		});

		$(document).on('mouseleave', '#map .box .icon', function() {
			$('#hover').hide();
		});
	});
});