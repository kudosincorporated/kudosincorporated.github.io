$(function() {

	const nodeDOM = (text) => {

		let $node = $('<div class="node">');
		let $label = $('<div class="label">').text(text);
		$progress = $('<div class="progress"><div class="inner"></div></div>');
		$label.append($progress);
		$node.append($label);
		let children = treeData[text];
		if (children) {
			let $children = $('<div class="children">');
			$node.append($children);
		} else {
			$node.addClass('end');
		}

		return $node;

	}

	let treeDataArray = Object.keys(treeData);

	$('#tree').append( nodeDOM(treeDataArray[0]) );

	$('#tree').on('click', '.node', function() {
		let $this = $(this);

		if ($(this).hasClass('end')) {
			return;
		} else {
			$(this).addClass('end');
		}

		let text = $(this).find('.label').text();
		let children = treeData[text];
		let speed = text.length*100;
		if (children) {
			
			$(this).find('.inner').css({
				transition: speed+'ms linear',
				width: '0%',
			});

			setTimeout(function() {
				children.forEach((child, i) => {
					setTimeout(function() {
						$this.find('.children').eq(0).append( nodeDOM(child) );
					}, i*100);
				});
			}, speed);

		}
	});

});