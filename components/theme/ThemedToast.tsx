import Modal from "react-native-modal";
import React, { Component, type ContextType } from "react";
import { View, Animated, Dimensions, TouchableOpacity } from "react-native";
import { styles } from "../styles/themed-toast";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "../ui";
import { Text, ThemeContext } from "@rneui/themed";
import type {
  MaterialIconsName,
  ThemedToastProps,
  ThemedToastState,
} from "@/types";

const { height, width } = Dimensions.get("window");
const defaultProps = {
  theme: "light",
  width: width * 0.8,
  height: "auto",
  style: {},
  textStyle: {},
  position: "top",
  positionValue: 30,
  end: 0,
  duration: 3000,
  animationInTiming: 300,
  animationOutTiming: 300,
  backdropTransitionInTiming: 300,
  backdropTransitionOutTiming: 300,
  animationIn: "",
  animationOut: "",
  animationStyle: "upInUpOut",
  hasBackdrop: false,
  backdropColor: "black",
  backdropOpacity: 0.2,
  showCloseIcon: true,
  showProgressBar: true,
};

class ThemedToast extends Component<ThemedToastProps, ThemedToastState> {
  private timer: NodeJS.Timeout;
  private isShow: boolean;
  static contextType = ThemeContext;
  static defaultProps = defaultProps;
  static __singletonRef: ThemedToast | null;

  constructor(props: ThemedToastProps) {
    super(props);
    ThemedToast.__singletonRef = this;
    this.timer = setTimeout(() => {}, 0); // Initialize timer with a dummy value
    this.isShow = false;
  }

  state: ThemedToastState = {
    isShow: false,
    text: "",
    opacityValue: new Animated.Value(1),
    barWidth: new Animated.Value(1),
    barColor: Colors.light.primary,
    icon: "check-box",
    position: this.props.position,
    animationStyle: {
      upInUpOut: {
        animationIn: "slideInDown",
        animationOut: "slideOutUp",
      },
      rightInOut: {
        animationIn: "slideInRight",
        animationOut: "slideOutRight",
      },
      zoomInOut: {
        animationIn: "zoomInDown",
        animationOut: "zoomOutUp",
      },
    },
  };

  static info = (text: string, position?: ThemedToastProps["position"]) => {
    ThemedToast.__singletonRef?.show(
      text,
      Colors.light.primary,
      "info",
      position
    );
  };

  static success = (text: string, position?: ThemedToastProps["position"]) => {
    ThemedToast.__singletonRef?.show(
      text,
      Colors.light.success,
      "check-circle",
      position
    );
  };

  static warn = (text: string, position?: ThemedToastProps["position"]) => {
    ThemedToast.__singletonRef?.show(
      text,
      Colors.light.warning,
      "warning",
      position
    );
  };

  static error = (text: string, position?: ThemedToastProps["position"]) => {
    ThemedToast.__singletonRef?.show(
      text,
      Colors.light.danger,
      "info-outline",
      position
    );
  };

  show = (
    text = "",
    barColor = Colors.light.primary,
    icon: MaterialIconsName,
    position?: ThemedToastProps["position"]
  ) => {
    const { duration } = this.props;
    this.state.barWidth.setValue(this.props.width);
    this.setState({
      isShow: true,
      duration,
      text,
      barColor,
      icon,
    });
    if (position) this.setState({ position });
    this.isShow = true;
    if (duration !== this.props.end) this.close(duration);
  };

  close = (duration: number) => {
    if (!this.isShow && !this.state.isShow) return;
    this.resetAll();
    this.timer = setTimeout(() => {
      this.setState({ isShow: false });
    }, duration || this.state.duration);
  };

  position = () => {
    const { position } = this.state;
    if (position === "top") return this.props.positionValue;
    if (position === "center") return height / 2 - 9;
    return height - this.props.positionValue - 10;
  };

  handleBar = () => {
    Animated.timing(this.state.barWidth, {
      toValue: 0,
      duration: this.state.duration,
      useNativeDriver: false,
    }).start();
  };

  pause = () => {
    this.setState({ oldDuration: this.state.duration, duration: 10000 });
    Animated.timing(this.state.barWidth, {
      toValue: 0,
      duration: this.state.duration,
      useNativeDriver: false,
    }).stop();
  };

  resume = () => {
    this.setState({ duration: this.state.oldDuration, oldDuration: 0 });
    Animated.timing(this.state.barWidth, {
      toValue: 0,
      duration: this.state.duration,
      useNativeDriver: false,
    }).start();
  };

  hideToast = () => {
    this.resetAll();
    this.setState({ isShow: false });
    this.isShow = false;
    if (!this.isShow && !this.state.isShow) return;
  };

  resetAll = () => {
    clearTimeout(this.timer);
  };

  render() {
    const { theme } = this.context as ContextType<typeof ThemeContext>;
    this.handleBar();
    const {
      animationIn,
      animationStyle,
      animationOut,
      backdropTransitionOutTiming,
      backdropTransitionInTiming,
      animationInTiming,
      animationOutTiming,
      backdropColor,
      backdropOpacity,
      hasBackdrop,
      width,
      height,
      style,
      textStyle,
      showCloseIcon,
      showProgressBar,
    } = this.props;

    const {
      isShow,
      animationStyle: stateAnimationStyle,
      barColor,
      icon,
      text,
      barWidth,
    } = this.state;

    return (
      <Modal
        animationIn={
          animationIn || stateAnimationStyle[animationStyle].animationIn
        }
        animationOut={
          animationOut || stateAnimationStyle[animationStyle].animationOut
        }
        backdropTransitionOutTiming={backdropTransitionOutTiming}
        backdropTransitionInTiming={backdropTransitionInTiming}
        animationInTiming={animationInTiming}
        animationOutTiming={animationOutTiming}
        onTouchEnd={this.resume}
        onTouchStart={this.pause}
        swipeDirection={["up", "down", "left", "right"]}
        onSwipeComplete={this.hideToast}
        onModalHide={this.resetAll}
        isVisible={isShow}
        coverScreen={false}
        backdropColor={backdropColor}
        backdropOpacity={backdropOpacity}
        hasBackdrop={hasBackdrop}
        style={styles.modalContainer}
      >
        <View
          style={[
            styles.mainContainer,
            {
              width,
              height,
              top: this.position(),
              backgroundColor: theme.colors.background,
              ...style,
            },
          ]}
        >
          {showCloseIcon && (
            <TouchableOpacity
              onPress={this.hideToast}
              activeOpacity={0.9}
              style={styles.hideButton}
            >
              <IconSymbol name="close" size={18} color={theme.colors.danger} />
            </TouchableOpacity>
          )}
          <View style={styles.content}>
            <IconSymbol
              name={icon}
              size={20}
              color={barColor}
              style={styles.iconWrapper}
            />
            <Text style={[styles.textStyle, textStyle]}>{text}</Text>
          </View>
          {showProgressBar && (
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={{ width: barWidth, backgroundColor: barColor }}
              />
            </View>
          )}
        </View>
      </Modal>
    );
  }
}

ThemedToast.defaultProps = defaultProps;

export default ThemedToast;
