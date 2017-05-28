/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import haversine from 'haversine';
import pick from 'lodash/pick';

const { width, height } = Dimensions.get('window');

export default class runTracker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			routeCoordinates: [],
			distanceTravelled: 0,
			prevLatLng: {}
		};
	}

	componentDidMount() {
		navigator.geolocation.getCurrentPosition(
			position => {},
			error => alert(error.message),
			{
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 1000,
				distanceFilter: 5
			}
		);
		this._watchID = navigator.geolocation.watchPosition(position => {
			const { routeCoordinates, distanceTravelled } = this.state;
			const newLatLngs = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			};
			const positionLatLngs = pick(position.coords, ['latitude', 'longitude']);
			this.setState({
				routeCoordinates: routeCoordinates.concat(positionLatLngs),
				distanceTravelled: distanceTravelled + this._calcDistance(newLatLngs),
				prevLatLng: newLatLngs
			});
		});
	}

	componentWillUnmount() {
		navigator.geolocation.clearWatch(this._watchID);
	}

	_calcDistance(newLatLng) {
		const { prevLatLng } = this.state;
		return haversine(prevLatLng, newLatLng) || 0;
	}

	_onRegionChange(region) {
		this.setState({ region });
	}

	render() {
		return (
			<View style={styles.container}>
				<MapView
					style={styles.map}
					region={this.state.region}
					onRegionChange={this.onRegionChange}
					mapType="satellite"
					showsUserLocation={true}
					followsUserLocation={true}
				>
					<MapView.Polyline
						coordinates={this.state.routeCoordinates}
						strokeColor="#19B5FE"
						lineWidth={50}
					/>
				</MapView>
				<View style={styles.navBar}>
					<Text style={styles.navBarText}>Run Tracker</Text>
				</View>
				<View style={styles.bottomBar}>
					<View style={styles.bottomBarGroup}>
						<Text style={styles.bottomBarHeader}>DISTANCE</Text>
						<Text style={styles.bottomBarContent}>
							{parseFloat(this.state.distanceTravelled).toFixed(2)} km
						</Text>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF'
	},
	navBar: {
		backgroundColor: 'rgba(0,0,0,0.7)',
		height: 64,
		width: width,
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	},
	navBarText: {
		color: '#19B5FE',
		fontSize: 16,
		fontWeight: '700',
		textAlign: 'center',
		paddingTop: 30
	},
	map: {
		flex: 0.7,
		width: width,
		height: height
	},
	bottomBar: {
		position: 'absolute',
		height: 100,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.7)',
		width: width,
		padding: 20,
		flexWrap: 'wrap',
		flexDirection: 'row'
	},
	bottomBarGroup: {
		flex: 1
	},
	bottomBarHeader: {
		color: '#fff',
		fontWeight: '400',
		textAlign: 'center'
	},
	bottomBarContent: {
		color: '#fff',
		fontWeight: '700',
		fontSize: 18,
		marginTop: 10,
		color: '#19B5FE',
		textAlign: 'center'
	}
});

AppRegistry.registerComponent('runTracker', () => runTracker);
